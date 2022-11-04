const express =  require('express');
const router = express.Router();
const {marked} = require('marked');
const slugify = require('slugify')
const createDomPurify = require('dompurify');
const {JSDOM} = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);
const db = require('../db/index');
const Article = require('../models/article')

const multer = require("multer");


const upload = multer({
  dest: "public/images"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

router.get('/new', (req, res)=>{
    if(!req?.session?.user){
        res.redirect('/');
        return;
    }
    res.render('articles/new', {article: "" });
})

router.get('/:slug', async (req, res)=>{
    let content = {};
    const article = await db.query( `SELECT *
    FROM public.article
    WHERE slug = $1;`,[req.params.slug]);
    
    if(article.rows?.length == 0){
        res.redirect('/');
    }
    content.article = article.rows[0];
    content.user = req.session.user;

    res.render('articles/show', {content : content});
})

router.get('/edit/:id', async (req, res)=>{
    if(!req?.session?.user){
        res.redirect('/');
        return;
    }
    const article = await db.query( 'SELECT * FROM public.article WHERE id = $1',[req.params.id]);
    res.render('articles/edit', {article: article.rows[0]});
})

router.post('/',upload.single('image'), (req, res, next)=>{
    if(!req?.session?.user){
        res.redirect('/');
        return;
    }
    console.log('file name: ', req.file.filename);
    next();
}, saveArticleAndRedirect('new'))

router.put('/:id', upload.single('image'), (req, res, next)=>{
    if(!req?.session?.user){
        res.redirect('/');
        return;
    }

    next();
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res)=>{
    if(!req?.session?.user){
        res.redirect('/');
        return;
    }
    await db.query( `DELETE FROM public.article
    WHERE id = $1`, [req.params.id]);
    res.redirect('/');
})

function saveArticleAndRedirect(path) {
    return async (req, res) =>{
        let article = {};
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;

        if(article.title){
            article.slug = slugify(article.title, {lower: true, strict: true})
        }
        if(article.markdown){
            article.sanitizedHtml = dompurify.sanitize(marked(article.markdown));
        }

        if(req.file?.filename){
            article.imageName = req.file.filename;
        }

        let slug = '';
        try {
            if(path == 'new'){
                slug = await db.query(`INSERT INTO public.article(
                    title, description, markdown, slug, sanitizedhtml, imagename)
                   VALUES ( $1, $2, $3, $4, $5, $6) RETURNING slug;`, Object.values(article));
            }
            if(path == 'edit'){
                let updatedSql = `UPDATE public.article
                SET  title=$1, description=$2, markdown=$3, slug=$4, sanitizedhtml=$5 `
                if(article.imageName){
                    updatedSql += ` , imagename = $6`;
                }
                updatedSql += ` , updatedat='${new Date().toDateString()}'`
                updatedSql += ` WHERE id =${req.params.id} RETURNING slug;`
                console.log(Object.values(article));
                slug = await db.query(updatedSql, Object.values(article));
            }
            res.redirect(`/articles/${slug.rows[0]?.slug}`)
        } catch (error) {
            console.log(error);
            res.render(`articles/index`)
        }
    }
}


module.exports = router;

