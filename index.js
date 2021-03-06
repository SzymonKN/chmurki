const express =require("express"),http = require("http")
const neo4j = require("neo4j-driver")
const path = require("path")

const app = express();
const  router = express.Router();

const driver = neo4j.driver("neo4j://neo4j.fis.agh.edu.pl:7687",neo4j.auth.basic("u7nowaks","297979"));



router.get("/", async function (req,res){
    res.sendFile(path.join(__dirname+"/public/index.html"))

})

//Na podstawie filmu
router.post("/movie",async function (req,res) {

    const session = driver.session();
    let movieTitle = req.body.data.movieValue

    let odp = []
    let result = null;
    result = await session.run('MATCH (h:u7nowaks_Hero)-[a:u7nowaks_APPEARED_IN]->(m:u7nowaks_Movie{Title:"'+movieTitle+'"}) RETURN h')
        .subscribe(
            {
                onNext(record) {
                    odp.push(record.get('h')['properties']['Name'])

                },
                onCompleted(summary) {
                    res.send(odp)
                }
            }
        )

})
//Na podstawie rasy
router.post("/race",async function (req,res) {

    const session = driver.session();
    let raceVal = req.body.data.raceValue

    let odp = []
    let result = null;
    result = await session.run('MATCH (h:u7nowaks_Hero)-[a:u7nowaks_RACE]->(m:u7nowaks_Race{Name:"'+raceVal+'"}) RETURN h')
        .subscribe(
            {
                onNext(record) {
                    odp.push(record.get('h')['properties']['Name'])

                },
                onCompleted(summary) {
                    res.send(odp)
                }
            }
        )

})
//Na podstawie supermocy
router.post("/superPower",async function (req,res) {

    const session = driver.session();
    let superPower = req.body.data.superpowerValue

    let odp = []
    let result = null;
    result = await session.run('MATCH (h:u7nowaks_Hero)-[a:u7nowaks_SUPERPOWER]->(m:u7nowaks_SuperPower{Type:"'+superPower+'"}) RETURN h')
        .subscribe(
            {
                onNext(record) {
                    odp.push(record.get('h')['properties']['Name'])

                },
                onCompleted(summary) {
                    res.send(odp)
                }
            }
        )

})
//Na podstawie płci
router.post("/gender",async function (req,res) {

    const session = driver.session();
    let genderValue = req.body.data.genderValue

    let odp = []
    let result = null;
    result = await session.run('MATCH (h:u7nowaks_Hero)-[a:u7nowaks_GENDER]->(m:u7nowaks_Gender{Name:"'+genderValue+'"}) RETURN h')
        .subscribe(
            {
                onNext(record) {
                    odp.push(record.get('h')['properties']['Name'])
                    
                },
                onCompleted(summary) {
                    res.send(odp)
                }
            }
        )

})
//Pokaż wszystkich z zależnościami
router.post("/showAll",async function (req,res) {

    const session = driver.session();

    let odp = []
    let result = null;
    result = await session.run('MATCH (h:u7nowaks_Hero)-[r]->(p) RETURN h,p')
        .subscribe(
            {
                onNext(record) {
                    odp.push(
                        [record.get('h')['properties']['Name'], record.get('p')['properties']]

                        )

                },
                onCompleted(summary) {
                    res.send(odp)
                }
            }
        )

})


driver.close()
app.use(express.urlencoded());
app.use(express.json());
app.use('/',router);
const PORT = process.env.PORT || 3000;
app.listen(PORT,function(){
    console.log('Running on ${ PORT }');
}
    );


