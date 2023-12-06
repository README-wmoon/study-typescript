const express = require('express');     // 옛날문법
// const cors = require('cors'); 
// const bodyParser = require('body-parser');

const app = express();
const mysql = require('mysql2/promise')
// require('dotenv').config({path:'../.env.local'});

const bcrypt = require('bcrypt');
// import 대신에 씀
const jwt = require("jsonwebtoken");

const dotenv = require('dotenv');
const { default: axios } = require('axios');
dotenv.config({path:'../.env.local'});

// mysql 설정
const pool = mysql.createPool({
    host:process.env.DB_HOST,
    database:process.env.DB_DATABASE,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT
});

const port = 3002;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// npm i cors 부터 설치하고 해야됨 3번쨰 방법
// app.use(cors({origin: 'http://localhost:3001'}));

app.get('/api', (req, res) => {
    let html = `
        <h1>메인페이지 입니다</h1>
    `;
    res.send(html);
});

// 모든 사원 조회
app.get('/api/employees', (req, res)=>{
    // mysql에서 employees 테이블 모든 행, 컬럼 조회
    pool.query('select * from employees', (err, rows, fields) => {
        // console.log(err);
        // console.log('res에는',rows);
        // console.log('field에는',fields);
        res.json(rows);
    });
});


// 사원 한명 추가
app.post('/api/employees', ()=> {});

// 토큰을 전달받아서 로그인한 사람의 email 주소를 되돌려주는 api
app.get('/api/loggedInEmail', (req,res)=>{
    // 리액트로부터 전달받은 토큰이 정상적인지 확인하고
    // 정상적이지 않으면 오류로 응답
    // 정상적이면 eamil주소로 응답
    // 토큰은 요청 header 의 Authorization에 Bearer .....
    console.log(req.headers.authorization);
    
    // 문자열
    const token = req.headers.authorization.replace('Bearer ', '');
    // console.log(token);
    // token은 로그인 당시 발급 받은 토큰
    try{
        let result = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(result);

        res.send(result.email);    

    }catch(err){
        console.log(err);
        res.status(403).json('오류발생!');

    }

});

app.get('/api/users/:email', async (req, res)=>{
    // console.log(req.params);
    const email = req.params.email;
    let sql = `
        SELECT email, created_date, updated_date, profile_url, cover_url
        from tbl_users
        WHERE email = ?
    `;
    // rows = 행 fileds = 컬럼

    try{
        let [rows, fileds] = await pool.query(sql, [email])
        
        // 어짜피 행은 하나가 나오니 0번쨰만 쓰면 된다.
        // header.js 안에  res2 data 안에 들어있음
        res.json(rows[0]);
    }catch(err){
        res.status(500).json('서버오류 발생!!!');
    }
});

// 회원 한명 추가
app.post('/api/users', async (req, res)=> {
    console.log(req.body);
    const sql = `INSERT INTO TBL_USERS
        (email, pw, question, answer)
        VALUES (?, ?, ?, ?)
    `;

    let {email, password, question, answer} = req.body;
    let enPw = bcrypt.hashSync(password, 10);

    try{
        let [result, fields] = await pool.query(sql, [email, enPw, question, answer]);
            console.log('result', result);
            console.log('fields: ', fields);
            res.json('포스트요펑에 대한 응답완료');
    }catch(err){
        if(err.errno === 1406) {
            res.status(400).json({errCode : 1, errMsg: '아이디가 너무김'});
        }else if (err.errno === 1062){
            // 아이디가 중복되었다 1062
            res.status(400).json({errCode : 2, errMsg: '아이디가 중복됨'});
        }else {
            // 그외
            res.status(400).json({errCode : 3, errMsg: '서버쪽에서 오류 발생함'});
        }
    }
    // mysql query 실행하기
    // pool.query(`INSERT INTO TBL_USERS
    // (email, pw, question, answer)
    // VALUES (?, ?, ?, ?)
    // `, [req.body.email, req.body.password, req.body.question, req.body.answer], 
    // (err, result, fields)=> {
    //     if(err !== null) {
    //         // 아이디가 컬럼의 초대 허용 용량을 벗어났다 1400
    //         if(err.errno === 1406) {
    //             res.status(400).json({errCode : 1, errMsg: '아이디가 너무김'});
    //         }else if (err.errno === 1062){
    //             // 아이디가 중복되었다 1062
    //             res.status(400).json({errCode : 2, errMsg: '아이디가 중복됨'});
    //         }else {
    //             // 그외
    //             res.status(400).json({errCode : 3, errMsg: '서버쪽에서 오류 발생함'});
    //         }
    //         res.status(400).json('실패함');
    //     }else {
    //         console.log('result', result);
    //         console.log('fields: ', fields);
    //         res.json('포스트요펑에 대한 응답완료');
    //     }
    // });

    // res.redirect('/');
});

app.post('/api/login', async (req, res)=>{
    const {email, password} = req.body;

    // mysql에서 해당 email과 해당 password가 존재하는지
    try{
        let sql = 'SELECT email, pw FROM tbl_users WHERE email=?';
        const [rows, fields] = await pool.query(sql, [ email ])
        console.log(rows);

        if(rows.length === 0) {
            res.status(404).json('로그인 실패!');
            return;
        }
        // 사용자가 로그인할때 입력한 일반 비밀번호랑, 암호화되어 저장된 비밀번호랑
        // 같은지 검사
        // 일반비밀번호: password
        // 암호화된 비밀번호 : rows[0].pw
        if(!bcrypt.compareSync(password, rows[0].pw)){
            // 이메일은 맞췄지만 비밀번호는 틀렸을때
            res.status(404).json('로그인실패');
            return;
        }

        // 로그인이 성공 했다면
        // jwt 토큰 만들기
        // payload에는 {email: '로그인한 사람이메일'}
        // 1시간짜리 유효한 토큰으로 만들기
        const accessToken = jwt.sign({email : rows[0].email}, process.env.JWT_SECRET, {expiresIn: '1h'});

        console.log(accessToken);

        // 만든 토큰을 객체에 담아서 리액트로 전달
        res.json({accessToken});
    }catch (err){
        console.log(err);
        res.status(500).json('mysql에서 오류발생');
    }

});



app.get('/api/jsonwebtokentest', (req, res )=> {

    // 암호화를 만드는 함수
    let myToken = jwt.sign({email: 'abc@naver.com'}, 'tokenpw', {expiresIn: '1h'})

    console.log(myToken);

    // let decoded = jwt.decode(myToken);
    // console.log(decoded);
    let verify = jwt.verify(myToken, 'tokenpw');
    console.log(verify);
    res.json('응답끝');
});

app.get('/api/career', async (req, res)=> {
    try{
        let sql = `
        select 
            id, 
            email, 
            company, 
            position, 
            date_format(start_date, '%Y년 %m월 %d일') start_date,
            date_format(end_date, '%Y년 %m월 %d일') end_date
        from tbl_careers
        where email = ?
        `

        let token = req.headers.authorization.replace('Bearer ', '');
        let {email} = jwt.verify(token, process.env.JWT_SECRET);

        // mysql가서 커리어 리스트 받아오고
        let [results, fields] =await pool.query(sql, [email]);

        // 리액트한테 받아온 배열 응답하기
        res.json(results);
    }catch(err) {
        console.log(err);
        res.status(500).json('서버쪽 오류 발생');
    }

});

// 커리어 추가 api
app.post('/api/career', async (req, res)=>{
    // email은 header에 있는 token에 들어있음
    const token = req.headers.authorization.replace('Bearer ', '');
    console.log("테스트 토큰", token);
    let {email} = jwt.verify(token, process.env.JWT_SECRET);

    const {company, position, startDate, endDate} = req.body;

    let sql = `
        INSERT INTO tbl_careers
        (email, company, position, start_date, end_date)
        values
        (
            ?, 
            ?, 
            ?, 
            str_to_date(?, '%Y-%m-%d'), 
            ${endDate === '' ? null : `str_to_date(?, '%Y-%m-%d')`}
        );
    `;

    let values = [email ,company, position, startDate];
    if(endDate !== '') {
        values.push(endDate);
    }

    try{
        let [results, fields] = await pool.query(sql, values);

        console.log(results);
        let [rows]= await pool.query('SELECT * FROM tbl_careers WHERE id=?', [results.insertId]);
        console.log(rows[0]);
        
        res.json(rows[0]);
    }catch(err){
        console.log(err);
        res.status(500).json('서버에서 오류 발생함');
    }
});

app.delete('/api/career', async (req, res)=>{
    // console.log(req.params);
    // console.log(res.body);
    // res.json(req.body);

    const {id} = req.body;
    // 삭제할 행 id는 id에 들어있음
    try{
        let [results, fileds] = await pool.query('DELETE FROM tbl_careers WHERE id =?', [id]);
        console.log(results);
        res.json('삭제성공!');

    }catch(err){
        console.log(err);
        res.status(500).json('삭제서버에서 오류 발생');
    }


});

app.put('/api/careers', async (req, res)=> {
    // react에서 넘겨준 값들(수정값들)
    console.log(req.body);
    const {company, position, startDate, endDate, id} = req.body;
    
    // 로그인 유저가 요청했는지 여부 검사
    console.log(req.headers.authorization);
    let token = req.headers.authorization.replace('Bearer ', '');
    try{
        jwt.verify(token, process.env.JWT_SECRET);

    }catch(err){
        res.status(403).json('토큰이 만료되었으니 다시 로그인 필요');
        return;
    }
    
    // 정상적인 토큰이라면 mysql 가서 수정 요청
    let sql = `
        UPDATE tbl_careers
        SET company = ?, position= ?, start_date = ?, end_date = ?
        WHERE id = ?
    `;
    try{
        await pool.query(sql, [company, position, startDate, endDate, id]);
    
        res.send('수정완료');

    }catch(err){
        console.log(err);
        res.status(500).json('오류 발생함');
    }

});

// activities get요청(게시글 목록 조회)
//                     몇페이지? 몇개? 정렬순서? 리액트가 알려주면 그만큼만 가져올것
app.get('/api/activities', async (req, res)=>{
    console.log(req.query); // {order: '', limit: '', page:'', q:''}
    let {order, limit, page, q} = req.query;
    limit = Number(limit);
    page = Number(page);

// order "dateDesc" 'dateAsc' 'like' 'view' 

// sql
   let sql = `
    select c.id ,
    c.title,
        c.content,
        c.writer_email,
        c.created_date,
        c.updated_date,
        c.activity_view,
        c.activity_like,
        if(d.email is null, 'no', 'yes') "liked"
    from (select a.id, 
        a.title,
        a.content,
        a.writer_email,
        a.created_date,
        a.updated_date,
        a.activity_view,
        IFNULL(b.like, 0) "activity_like"
        from tbl_activities a left outer join (
        select activity_id, count(*) "like"
        from tbl_activity_like
        group by activity_id
        ) b
    on a.id = b.activity_id) c left outer join (select * from tbl_activity_like
    where email = ?) d
    on c.id = d.activity_id
    where title like ?
    `;

    if(order === 'view') {
        sql += 'order by activity_view desc';
    }else if(order === 'like'){
        sql += 'order by activity_like desc';
    }else if(order === 'dateAsc'){
        sql += 'order by created_date asc';
    }else{
        sql += 'order by created_date desc';
    }

    sql += ' limit ? offset ?';
    // limit에는 한페이지당 볼 갯수 2
    // page에는 볼 페이지 1 --> 0 2 --> 2 3 --> 4

    try{

        // 로그인 한 사람의 이메일 정보(access토큰에 들어있다)
        const token = req.headers.authorization.replace('Bearer ', '');
        const user = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(token);
        // console.log(user);
        let [results] = await pool.query(sql, [user.email,`%${q}%`, limit, limit * (page -1)]);
        
        console.log(results);

        // 각 게시물에 대한 이미지 가져오기
        sql = 'select img_url from tbl_activity_img where activity_id=?';
        // 각각의 게시물 이미지 url을 각 객체 속에 넣어주기
        for(let i =0; i< results.length; i++) {
            let [imgs] = await pool.query(sql, [results[i].id]);
            console.log("imgs :",imgs);
            results[i].img_url = imgs.map(el=> el.img_url);
        }

        // console.log(results);
       

        

        // 전체게시물 갯수
        sql = `select count(*) "total_cnt" 
        from tbl_activities
        where title like ?`;
    
    
        const [results2] = await pool.query(sql, [`%${q}%`]);
        console.log(results2);  //[{total_cnt : 5}]
    
        // 객체로 전달해줄려고 썻음
        res.json({total_cnt:results2[0].total_cnt, activityList: results});
    }catch(err){
        console.log(err);
        res.status(500).json('오류발생했음');
    }

    // 

});

// 좋아요 테이블에 추가 필요한 정보(리액트가 줘야하는 건 게시물id, 로그인한 사람email)
app.post('/api/like', async(req,res)=>{
    const id = req.body.id; //게시물 id
    const token = req.headers.authorization.replace('Bearer ', '');
    const user = jwt.verify(token, process.env.JWT_SECRET);
    // user.email : 로그인한 사람 : email

    let sql = `
        insert into tbl_activity_like
        values (?, ?);
    `;

    try{
        //추가해줘 안해줘 떄문에 결과를 쓰지 않는다.(변수가 두개밖에 없음)
        await pool.query(sql, [id, user.email]);
        res.json('추가성공');
    }catch(err){
        console.log(err);
        res.status(500).json('서버에서 오류 발생');
    }
})
// 좋아요 테이블에 삭제(리액트가 줘야하는 건 게시물id, 로그인한 사람email)
app.delete('/api/like', async(req,res)=>{
    const id = req.body.id; //게시물 id
    const token = req.headers.authorization.replace('Bearer ', '');
    const user = jwt.verify(token, process.env.JWT_SECRET);
    // user.email : 로그인한 사람 : email
    let sql = `
        delete from tbl_activity_like
        where activity_id = ? and email = ?
    `;

    
    try{
        await pool.query(sql, [id, user.email]);
        res.json('삭제 성공');
    }catch(err){
        console.log(err);
        res.status(500).json('서버 오류 발생')
    }
})

// multer 라이브러리 설정
const multer = require('multer');
const uuid = require('uuid');


const upload = multer({
    storage:multer.diskStorage({
        destination: (req, file, cb)=> {
            cb(null, '../public/images/');
        },
        filename: (req, file, cb)=>{
            let id = uuid.v4();
            let now = new Date();
            let fileName = `${id}${now.getSeconds()}${file.originalname}`;
            cb(null, fileName);
        }
    }),
    limits:{fileSize : 1024 * 1024 * 5} // 5메가바이트
});

// 파일 sync 라이브러리
const fs = require('fs');

app.put('/api/activities',upload.array('images'), async (req, res)=>{
    // console.log(req.files);
    // console.log(req.body);
    // console.log(req.headers.authorization);

    let sql = `
        delete from tbl_activity_img
        where img_url = ?
    `;

    console.log(req.body.deleteImg);
    const deleteImg = JSON.parse(req.body.deleteImg);
    // const deleteImg = req.body.deleteImg;
    try{
        for(let i =0; i<deleteImg.length; i++) {
            console.log(deleteImg[i]);
            await pool.query(sql, [deleteImg[i]]); // 테이블에서 이미지 삭제
            fs.unlinkSync(`../public${deleteImg[i]}`); // 폴더에서 이미지 삭제
        }
    
        sql = `
            update tbl_activities
            set title=?, content=?, updated_date=now()
            where id = ?
        `;
    
        await pool.query(sql, [req.body.title, req.body.content, req.body.id]);
        
        sql = `
            insert into tbl_activity_img
            values(?, ?)
        `;

        for(let i=0; i < req.files.length; i++){
            await pool.query(sql, [Number(req.body.id), `/images/${req.files[i].filename}`]);

        }
        
        res.json({id:Number(req.body.id)});
        
    }catch(err){
        console.log(err)
        res.status(500).json('에러발생!!@');
    }
})


app.post('/api/activities',upload.array('images'), async(req, res)=>{
    // console.log(req.files);
    // console.log(req.body);
    // console.log(req.headers.authorization);
    // upload.array('images') 떄문에 이미 이미지 업로드 되었고, 그 뒤에

    // mysql에 게시글 제목, 내용, 작성자, 작성일자 insert into
    const token = req.headers.authorization.replace('Bearer ', '');
    const user = jwt.verify(token, process.env.JWT_SECRET);
    
    const {title, content} = req.body;
    // req.files[0].fliename
    try{
        let sql = `
        insert into tbl_activities
        (title, content, writer_email, activity_view)
        values
        (?, ?, ?, 0);
        `;
        let [result] = await pool.query(sql, [
            title,
            content,
            user.email
        ]);
        // result.insertId --> 방금 추가된 행의 id 값
        // console.log(result);

        // 이미지 경로도 mysql의 tbl_activity_img 에 올리기
        sql = `
        insert into tbl_activity_img
        values
        (?, ?);
        `;
        for(let i=0; i<req.files.length; i++) {
            await pool.query(sql, [result.insertId, '/images/' + req.files[i].filename]);
        }

        // react에게 응답
        res.json({id: result.insertId})

    }catch(err){
        res.status(500).json('오류발생응@@@')
    }

})

app.get('/api/activities/:id', async(req, res) => {
    const id = req.params.id;
    const token = req.headers.authorization.replace('Bearer ', '');
    const user = jwt.verify(token, process.env.JWT_SECRET);
    
    try{
        let sql = `
            select activity_view
            from tbl_activities
            where id = ?;
        `;
        let [views] = await pool.query(sql, [id]);

        sql = `
            update tbl_activities
            set activity_view = ?
            where id = ?;
        `;
        await pool.query(sql, [views[0].activity_view + 1,  id])

        sql = `
            select *
            from tbl_activities
            where id=?
        `;
        let [result1] = await pool.query(sql, [id]);
        sql = `
            select count(*) "activity_like"
            from tbl_activity_like
            where activity_id = ?
        `;
        let [result2] = await pool.query(sql, [id]);
        
        sql = `
            select * from tbl_activity_like
            where activity_id = ? and email = ?
        `;

        let [result3] = await pool.query(sql, [id, user.email])
        sql = `
            select * from tbl_activity_img
            where activity_id = ?
        `;
        let [result4] = await pool.query(sql, [id]);
        result1[0].activity_like = result2[0].activity_like;
        result1[0].liked = result3.length === 0 ? 'no' : 'yes';
        result1[0].img_url = result4.map((el)=> el.img_url);
        result1[0].owner = user.email === result1[0].writer_email

        console.log(result1[0])
        res.json(result1[0]);

    }catch(err){
        console.log(err);
        res.status(500).json('오류발생@@!');
    }
})

app.delete('/api/activities/:id', async(req, res)=>{

    try{
        // 1. 로그인 한 사람의 email
        let token = req.headers.authorization.replace('Bearer ', '');
        let user = jwt.verify(token, process.env.JWT_SECRET);
    
        // user.email --> 로그인 한 사람의 이메일
        let id = Number(req.params.id) // 삭제하려는 게시글 아이디
    
        let sql = `
            select * from tbl_activities
            where id = ?
        `;
        let [rows] = await pool.query(sql, [id]);
        if(rows[0].writer_email !== user.email){
            res.status(403).json('접근 권한 없음');
            return;
        }
        sql = `
            delete from tbl_comments
            where activity_id = ?
    
        `;
    
        await pool.query(sql, [id])
    
        sql = `
            delete from tbl_activity_like
            where activity_id = ?
    
        `;
    
        await pool.query(sql, [id]);
    
        sql = `
            select * from tbl_activity_img
            where activity_id = ?
        `;
    
        let [imgs] = await pool.query(sql, [id]);
        for(let i = 0; i< imgs.length; i++) {
            fs.unlinkSync(`../public${imgs[i].img_url}`);
        }


        sql = `
            delete from tbl_activity_img
            where activity_id = ?
        `;
    
        await pool.query(sql, [id]);
        
    
        sql = `
            delete from tbl_activities
            where id = ?
        `;
        pool.query(sql,[id]);

        res.json('삭제 성공');

    }catch(err){
        res.status(500).json('삭제 오류발생');
    }
})

app.get('/api/comments', async(req, res)=>{
    const activityId = Number(req.query.activityId);
    const limit = Number(req.query.limit); //몇개
    const page = Number(req.query.page); // 몇페이지?
    const offset = (page -1) * limit;
    let sql = `
        select * from tbl_comments
        where activity_id = ?
        order by created_date asc
        limit ? offset ?;
    `;



    try{
        const token =req.headers.authorization.replace('Bearer ', '')
        let user = jwt.verify(token, process.env.JWT_SECRET);
        let [results] = await pool.query(sql, [activityId, limit, offset])


        results = results.map((el)=> ({...el, owner:el.writer_email === user.email}))

        console.log(results);
        res.json(results);

    }catch(err){
        res.status(500).json('오류발생스@@@@');
    }

})

app.post('/api/comments', async (req, res)=>{
    const token = req.headers.authorization.replace('Bearer ', '');
    const user = jwt.verify(token, process.env.JWT_SECRET);

    const content = req.body.content;
    const activityId = req.body.activityId;


    let sql= `
        insert into tbl_comments
        (content, activity_id, writer_email)
        values(?, ?, ?)
    `;

    try{
        let [result] = await pool.query(sql, [content, activityId, user.email]);
        let [rows] = await pool.query('select * from tbl_comments where id=?', [result.insertId])
        console.log(rows);
        res.json({...rows[0], owner:rows[0].writer_email === user.email});

    }catch(err){
        res.status(500).json('서버 오류발생');
    }
});

app.delete('/api/comments', async(req, res)=>{
    const id = req.body.id // react에서 받아온 삭제할 댓글의 id
    try{
        await pool.query('delete from tbl_comments where id = ?', [id]);
        res.json('성공');
    }catch(err){
        res.status(500).json('오류발생');
    }
});

app.put('/api/comments', async (req, res)=>{
    const id = req.body.id;
    const content = req.body.content;
    const token = req.headers.authorization.replace('Bearer ', '');
    const user = jwt.verify(token, process.env.JWT_SECRET);
    let sql = `
            update tbl_comments
            set content = ?, updated_date = now()
            where id = ?
    `;

    try{
            await pool.query(sql, [content, id]);
            // console.log("댓글테스트", result);
            let [rows] = await pool.query('select * from tbl_comments where id=?', [id]);
            res.json({...rows[0], owner: rows[0].writer_email === user.email});

    }catch(err){
            res.status(500).json('mysql 오류');
    }
});

app.listen(port, ()=> {console.log(`app listening on port ${port}`)});