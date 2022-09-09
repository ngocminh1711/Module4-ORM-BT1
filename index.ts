import { AppDataSource} from "./src/data-source";
import { Blog } from "./src/entity/Blog";
import multer from 'multer';
const upload = multer();
import express from 'express';
import bodyParser from "body-parser";
import * as path from "path";

const PORT =3000;

AppDataSource.initialize().then(async connection => {
    const app = express();

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');


    app.use(bodyParser.json());
    app.use(express.json());

    const BlogRepo = connection.getRepository(Blog)


    app.get('/blog/create', (req, res) => {
        res.render('blog');
    })
    app.post('/blog/create',upload.none(), async(req, res) => {
        const blogData = {
            id: req.body.id,
            title: req.body.title,
            content: req.body.content
        }

        await BlogRepo.save(blogData);
        res.redirect('/blog/title')
    })
    app.get('/blog/title', async(req, res) => {
        const blogs = await BlogRepo.find();
        res.render('title', {blogs: blogs})
    })

    app.listen(PORT, ()=> {
        console.log('http://localhost:'+PORT);
    });
})
