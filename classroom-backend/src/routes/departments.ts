import express from "express";
import { departments } from "../db/schema/index.js";
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

export default router;
