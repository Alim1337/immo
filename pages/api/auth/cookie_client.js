import{sign} from "jsonwebtoken";
import { serialize } from "cookie";

const secret = process.env.SECRET;
export default async function handler(req, res) {
    const { email, mdps } = req.body;

res.status(401).json({message:"invalide"})

}
