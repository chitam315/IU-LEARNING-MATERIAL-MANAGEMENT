import authRouter from "./auth.js";
import courseRouter from './course.js'
import fileRouter from './file.js'
import thesisRouter from './thesis.js'
import announcementRouter from './announcement.js'
import messageRouter from './message.js'

function router(app) {
  app.use("/auth", authRouter);
  app.use("/course",courseRouter)
  app.use("/file",fileRouter)
  app.use("/thesis",thesisRouter)
  app.use("/announcement",announcementRouter)
  app.use("/message",messageRouter)
  app.get('/',(req,res,next) => res.json('My API is running') )
}

export default router;
