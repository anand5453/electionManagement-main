import express from 'express'
import protectRoute from '../middleware/protecRoute.js'
import { getElectionById, getElections } from '../controller/electionController.js'

const router=express.Router()

router.get("/home",protectRoute,getElections)
router.get("/:id",protectRoute,getElectionById)
export default router