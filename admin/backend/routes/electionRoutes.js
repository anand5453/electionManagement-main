import express from 'express'
import { addElection, deleteElectionById, getAllElections, getElectionById } from '../controller/electionController.js'
import protectRoute from '../middleware/protecRoute.js'

const router=express.Router()

router.post("/add-election",protectRoute,addElection)
router.get("/get-elections",protectRoute,getAllElections)
router.get("/get-election/:id",protectRoute,getElectionById)
router.delete("/delete-election/:id", deleteElectionById);
export default router