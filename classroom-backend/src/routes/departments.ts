import express from "express";
import { classes, departments, enrollments, subjects } from "../db/schema/index.js";
import { and, eq, getTableColumns, ilike, or, sql, desc } from "drizzle-orm";
import { db } from "../db/index.js";

const router = express.Router();
//get all departments with optional search filtering and pagination
router.get("/", async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
    const limitPerPage = Math.min(
      Math.max(1, parseInt(String(limit), 10) || 10),
      100
    );
    const offset = (currentPage - 1) * limitPerPage;

    const filterConditions = [];

    if (search) {
      const searchPattern = `%${(search as string).replace(/[%_]/g, "\\$&")}%`;
      filterConditions.push(
        or(
          ilike(departments.name, searchPattern),
          ilike(departments.code, searchPattern)
        )
      );
    }
    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(departments)
      .where(whereClause);

    const totalCount = countResult[0]?.count ?? 0;

    const departmentsList = await db
      .select({
        ...getTableColumns(departments),
      })
      .from(departments)
      .where(whereClause)
      .orderBy(desc(departments.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    res.status(200).json({
      data: departmentsList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    });
  } catch (e) {
    console.log("GET /departments error:", e);
    res.status(500).json({ error: "Failed to get departments" });
  }
});

router.post("/", async (req, res) => {
  try {
    const [createdDept] = await db
      .insert(departments)
      .values(req.body)
      .returning({ id: departments.id });

    if (!createdDept) throw new Error("Department creation failed");

    return res.status(201).json({ data: createdDept });
  } catch (error) {
    console.error("POST /departments error:", error);
    return res.status(500).json({ error: "Failed to create department" });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const deptId = Number(req.params.id);

    // Validate that the ID is a valid number [9]
    if (!Number.isFinite(deptId)) {
      return res.status(400).json({ error: "Invalid department ID" });
    }

    // 1. Fetch Department Metadata
    const [department] = await db
      .select(getTableColumns(departments))
      .from(departments)
      .where(eq(departments.id, deptId));

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    // 2. Calculate Totals (Subjects, Classes, and Students) [1]
    
    // Count total subjects in this department
    const [subjectsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(subjects)
      .where(eq(subjects.departmentId, deptId));

    // Count total classes across all subjects in this department
    const [classesCount] = await db
      .select({ count: sql<number>`count(${classes.id})` })
      .from(classes)
      .innerJoin(subjects, eq(classes.subjectId, subjects.id))
      .where(eq(subjects.departmentId, deptId));

    // Count unique enrolled students in this department's classes [10, 11]
    const [studentsCount] = await db
      .select({ count: sql<number>`count(distinct ${enrollments.studentId})` })
      .from(enrollments)
      .innerJoin(classes, eq(enrollments.classId, classes.id))
      .innerJoin(subjects, eq(classes.subjectId, subjects.id))
      .where(eq(subjects.departmentId, deptId));

    // 3. Return combined DepartmentWithTotals object [1, 12]
    return res.status(200).json({
      data: {
        department,
        totals: {
          subjects: Number(subjectsCount?.count || 0),
          classes: Number(classesCount?.count || 0),
          enrolledStudents: Number(studentsCount?.count || 0)
        }
      }
    });

  } catch (error) {
    console.error("GET /departments/:id error:", error);
    return res.status(500).json({ error: "Failed to get department details" [13] });
  }
});

export default router;
