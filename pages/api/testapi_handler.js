/*export default async function handler(req, res) {
    const endpoint = '/api/my-custom-endpoint'; // change this to your desired endpoint
    
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' })
    }
  
    try {
      const users = await prisma.user.findMany()
      res.status(200).json(users)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Server error' })
    }
  }
  */