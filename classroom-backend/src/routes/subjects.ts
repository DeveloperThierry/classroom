import express from 'express'
import { departments, subjects } from '../db/schema/index.js'
import { and, eq, getTableColumns, ilike, or, sql, desc } from 'drizzle-orm'
import { db } from '../db/index.js'

const router = express.Router()
//get all subjects with optional search filtering and pagination
router.get("/", async (req, res) => {
    try{
        const {search, department, page=1, limit=10} = req.query
        const currentPage = Math.max(1, parseInt(String(page), 10) || 1)
        const limitPerPage = Math.min(Math.max(1, parseInt(String(limit), 10) || 10), 100)
        const offset = (currentPage - 1) * limitPerPage
        
        const filterConditions = []

        if(search){
            filterConditions.push(
                or(
                    ilike(subjects.name, `%${search}%`),
                    ilike(subjects.code, `%${search}%`)
                )
            )
        }
        if(department){
            filterConditions.push(
                or(
                    ilike(departments.name, `%${department}%`),
                    ilike(departments.code, `%${department}%`)
                )
            )
        }
        const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined

        const countResult = await db.select({count:sql<number>`count(*)`}).from(subjects).leftJoin(departments, eq(subjects.departmentId, departments.id)).where(whereClause)

        const totalCount = countResult[0]?.count ?? 0

        const subjctsList = await db.select({...getTableColumns(subjects), department: {...getTableColumns(departments)}}).from(subjects).leftJoin(departments, eq(subjects.departmentId, departments.id)).where(whereClause).orderBy(desc(subjects.createdAt)).limit(limitPerPage).offset(offset)

        res.status(200).json({
            data:subjctsList,
            pagination:{
                page:currentPage,
                limit:limitPerPage,
                total:totalCount,
                totalPages:Math.ceil(totalCount/limitPerPage)
            }
        })
    } catch(e){
        console.log('GET /subjects error:', e)
        res.status(500).json({error:'Failed to get subjects'})
    }
})

router.post("/", async (req, res) => {
    try {
      const { name, code, description, departmentId } = req.body;
  
      const [createdSubject] = await db
        .insert(subjects)
        .values({
          name,
          code,
          description,
          departmentId,
        })
        .returning({ id: subjects.id }); 
  
      if (!createdSubject) {
        throw new Error("Failed to create subject");
      }
  
      return res.status(201).json({ data: createdSubject });
    } catch (error) {
      console.error("post /subjects error", error);
      return res.status(500).json({ 
        error: "failed to create subject" 
      });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const subjectId = Number(req.params.id);
      if (!Number.isFinite(subjectId)) {
        return res.status(400).json({ error: "Invalid subject ID" });
      }
  
      const [subjectDetails] = await db
        .select({
          ...getTableColumns(subjects),
          department: getTableColumns(departments),
        })
        .from(subjects)
        .leftJoin(departments, eq(subjects.departmentId, departments.id))
        .where(eq(subjects.id, subjectId));
  
      if (!subjectDetails) {
        return res.status(404).json({ error: "Subject not found" });
      }
  
      return res.status(200).json({ data: subjectDetails });
    } catch (error) {
      console.error("GET /subjects/:id error:", error);
      return res.status(500).json({ error: "Failed to fetch subject details" });
    }
  });

export default router