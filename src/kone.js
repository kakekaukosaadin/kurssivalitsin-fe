import {useEffect, useState} from "react";
import store from "./store";
import 'bootstrap/dist/css/bootstrap.min.css'
import stylesheet from "./css/stylesheet.module.css"

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table'




const Kone = () => {
    const [courses, setCourses] = useState([]);
    const [userChoices, setUserChoices] = useState([]);

    const [user, setUser] = store.useState("user")


    useEffect(() => {
        fetch('https://api.kurssivalitsin.com/courses.php', {
            method: 'GET',
        }).then(res => res.json())
            .then(data => setCourses(data));
        getUserChoices();
    }, []);

    const getUserChoices = function (){
        fetch('https://api.kurssivalitsin.com/calculated_course/read.php?user='+user, {
            method: 'GET',
        }).then(res => res.json())
            .then(data => setUserChoices(data));
        return userChoices

    };

    const postChoice = function (name, jnum, method) {
        return function () {
            if(method === 'POST') {
                fetch('https://api.kurssivalitsin.com/user_choice/create.php', {
                    method : 'POST',
                    body: JSON.stringify({
                        name: name,
                        j_num: Number(jnum),
                        user_id: Number(user)
                    }),
                })
                    .then(res => res.json())
                    .then(data => {
                        setUserChoices(getUserChoices())
                    })
            } else {
                fetch('https://api.kurssivalitsin.com/user_choice/delete.php', {
                    method: 'DELETE',
                    body: JSON.stringify({
                        name: name,
                        j_num: Number(jnum),
                        user_id: Number(user),
                    }),
                })
                    .then(res => res.json())
                    .then(data => {
                        setUserChoices(getUserChoices())
                    })
            }
        }
    }

    const deleteAllChoices = function () {
        fetch('https://api.kurssivalitsin.com/calculated_course/all.php?user='+user, {
            method: 'DELETE'
        })
            .then(res => {
                setUserChoices(getUserChoices())
            })
    }

    function groupArrayOfObjects(list, key) {
        return list.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }

    let choiceName = userChoices.map(choice => choice.name + choice.j_num);

    let reducedObj = courses.map(({name, j_num}) => {
        let yht = name+j_num;
        return {name, j_num, yht}
    });

    const uniqueNames = [];
    const uniqueObj = reducedObj.filter(element => {
        const isDuplicate = uniqueNames.includes(element.yht);

        if(!isDuplicate){
            uniqueNames.push(element.yht);
            return true;
        }
        return false
    });

    let grouped = groupArrayOfObjects(uniqueObj, "name");
    let groupedArr = Object.entries(grouped).sort();

    function compareCourses(a, b) {
        const jnumA = Number(a.j_num);
        const jnumB = Number(b.j_num);
        let comparison = 0
        if(jnumA > jnumB) {comparison = 1}
        else if(jnumA < jnumB) {comparison = -1}
        return comparison
    }

    let sortedGroupedArr = groupedArr.map(obj => {
        return [obj[0], obj[1].sort(compareCourses)]
    })

    //console.log(sortedGroupedArr)

    let excluded = ["LI21", "LI11", "MAA23", "MAA34", "MAA4", "MAA67", "MAA79", "AI572", "AI682", "RUB11122", "ENA122","AI572", "AI682"];

    function mergedCourses(yht) {
        if(yht === "ENA12") {return "ENA1 & ENA2"}
        else if(yht === "FY12") {return "FY1 & FY2"}
        else if(yht === "BI23") {return "BI2 & BI3"}
        else if(yht === "KE12") {return "KE1 & KE2"}
        else if(yht === "MAA2") {return "MAA2 & MAA3 & MAA4"}
        else if(yht === "MAA6") {return "MAA6 & MAA7 & MAA9"}
        else if(yht === "MAB67") {return "MAB6 & MAB7"}
        else if(yht === "RUB1112") {return "RUB11 & RUB12"}
        else if(yht === "aRUB1112") {return "RUB11 & RUB12 (1A)"}
        else if(yht === "dRUB1112") {return "RUB11 & RUB12 (1D)"}
        else if(yht === "eRUB1112") {return "RUB11 & RUB12 (1E)"}
        else if(yht === "bENA12") {return "ENA1 & ENA2 (1B)"}
        else if(yht === "cENA12") {return "ENA1 & ENA2 (1C)"}
        else if(yht === "fENA12") {return "ENA1 & ENA2 (1F)"}
        else if(yht === "AI23") {return "AI2 & AI3"}
        else if(yht === "AI57") {return "AI5 & AI7"}
        else if(yht === "AI68") {return "AI6 & AI8"}
        else return yht
    }

    function mergedCoursesRes(yht, snum) {
        if(yht === "ENA12") {return "ENA1."+snum+" & ENA2."+snum}
        else if(yht === "ENA122") {return "ENA1."+snum+" & ENA2."+snum}
        else if(yht === "FY12") {return "FY1."+snum+" & FY2."+snum}
        else if(yht === "BI23") {return "BI2."+snum+" & BI3."+snum}
        else if(yht === "KE12") {return "KE1."+snum+" & KE2."+snum}
        else if(yht === "MAA23") {return "MAA2."+snum+" & MAA3."+snum}
        else if(yht === "MAA34") {return "MAA3."+snum+" & MAA4."+snum}
        else if(yht === "MAA67") {return "MAA6."+snum+" & MAA7."+snum}
        else if(yht === "MAA79") {return "MAA7."+snum+" & MAA9."+snum}
        else if(yht === "MAB67") {return "MAB6."+snum+" & MAB7."+snum}
        else if(yht === "RUB1112") {return "RUB11."+snum+" & RUB12."+snum}
        else if(yht === "RUB11122") {return "RUB11."+snum+" & RUB12."+snum}
        else if(yht === "aRUB1112") {return "RUB11."+snum+" & RUB12."+snum+" (1A)"}
        else if(yht === "dRUB1112") {return "RUB11."+snum+" & RUB12."+snum+" (1D)"}
        else if(yht === "eRUB1112") {return "RUB11."+snum+" & RUB12."+snum+" (1E)"}
        else if(yht === "bENA12") {return "ENA1."+snum+" & ENA2."+snum+" (1B)"}
        else if(yht === "cENA12") {return "ENA1."+snum+" & ENA2."+snum+" (1C)"}
        else if(yht === "fENA12") {return "ENA1."+snum+" & ENA2."+snum+" (1F)"}
        else if(yht === "AI23") {return "AI2."+snum+" & AI3."+snum}
        else if(yht === "AI57") {return "AI5."+snum+" & AI7."+snum}
        else if(yht === "AI572") {return "AI5."+snum+" & AI7."+snum}
        else if(yht === "AI68") {return "AI6."+snum+" & AI8."+snum}
        else if(yht === "AI682") {return "AI6."+snum+" & AI8."+snum}
        else return yht+"."+snum
    }

    function mapCategory(lyh){
        if(lyh === "SAB") {return "Saksa(B2 ja B3)"}
        else if(lyh === "ENA") {return "Englanti"}
        else if(lyh === "MAA") {return "Matikka, pitkä oppimäärä"}
        else if(lyh === "KE") {return "Kemia"}
        else if(lyh === "GE") {return "Maantieto"}
        else if(lyh === "HI") {return "Historia"}
        else if(lyh === "TE") {return "Terveystieto"}
        else if(lyh === "LI") {return "Liikunta"}
        else if(lyh === "AI") {return "Äidinkieli"}
        else if(lyh === "wGE") {return "Maantieto(vanha LOPS)"}
        else if(lyh === "KU") {return "Kuvataide"}
        else if(lyh === "wKU") {return "Kuvataide(vanha LOPS)"}
        else if(lyh === "wVEB") {return "Venäjä(vanha LOPS)"}
        else if(lyh === "wENA") {return "Englanti(vanha LOPS)"}
        else if(lyh === "wAI") {return "Äidinkieli(vanha LOPS)"}
        else if(lyh === "BI") {return "Biologia"}
        else if(lyh === "MU") {return "Musiikki"}
        else if(lyh === "EAB") {return "Espanja(B2 ja B3)"}
        else if(lyh === "FI") {return "Filosofia"}
        else if(lyh === "wFI") {return "Filosofia(vanha LOPS)"}
        else if(lyh === "UE") {return "Uskonto/Elämänkatsomustieto (UE)"}
        else if(lyh === "wMAA") {return "Matematiikka, pitkä(vanha LOPS)"}
        else if(lyh === "wMAB") {return "Matematiikka, lyhyt(vanha LOPS)"}
        else if(lyh === "wLI") {return "Liikunta(vanha LOPS)"}
        else if(lyh === "RUB") {return "Ruotsi"}
        else if(lyh === "YH") {return "Yhteiskuntaoppi"}
        else if(lyh === "PS") {return "Psykologia"}
        else if(lyh === "wRUB") {return "Ruotsi(vanha LOPS)"}
        else if(lyh === "MAB") {return "Matematiikka, lyhyt oppimäärä"}
        else if(lyh === "wYH") {return "Yhteiskuntaoppi(vanha LOPS)"}
        else if(lyh === "wFY") {return "Fysiikka(vanha LOPS)"}
        else if(lyh === "wPS") {return "Psykologia(vanha LOPS)"}
        else if(lyh === "FY") {return "Fysiikka"}
        else if(lyh === "RAB") {return "Ranska(B2 ja B3)"}
        else if(lyh === "wBI") {return "Biologia(vanha LOPS)"}
        else if(lyh === "wHI") {return "Historia(vanha LOPS)"}
        else if(lyh === "wTE") {return "Terveystieto(vanha LOPS)"}
        else if(lyh === "wEAB") {return "Espanja(vanha LOPS)"}
        else if(lyh === "TO") {return "Temaattiset opinnot"}
        else if(lyh === "wOP") {return "Opinto-ohjaus(vanha LOPS)"}
        else if(lyh === "VEB") {return "Venäjä"}
        else if(lyh === "DR") {return "Draama"}
        else if(lyh === "wDR") {return "Draama(vanha LOPS)"}
        else if(lyh === "wSAB") {return "Saksa(vanha LOPS)"}
        else if(lyh === "wUE") {return "Uskonto(vanha LOPS)"}
        else if(lyh === "ET") {return "Uskonto/Elämänkatsomustieto (ET)"}
        else if(lyh === "YR") {return "Yrittäjyysopinnot"}
        else if(lyh === "UO") {return "UO"}
        else return lyh
    }

    let excludedCategories = ["cENA", "dRUB", "fENA", "bENA", "eRUB", "aRUB"]
    let continuingCourses = [
        {name: "aRUB", j_num: "1112"},
        {name: "bENA", j_num: "12"},
        {name: "cENA", j_num: "12"},
        {name: "dRUB", j_num: "1112"},
        {name: "eRUB", j_num: "1112"},
        {name: "fENA", j_num: "12"}
    ]


    //console.log(user);
    return (
        <div className={stylesheet.koneCont} key="konenapit">
            <Row>
                <Col className={stylesheet.btnCol}>
                    <DropdownButton className={stylesheet.customDdb} title={"1. Jaksosta jatkavat"}>
                        {
                            continuingCourses.map(course => {
                                let method = "";
                                let Vcolor = "black"
                                let Bcolor = "white"
                                if(choiceName.includes(course.name+course.j_num)){
                                    method = 'DELETE';
                                    Vcolor = "white"
                                    Bcolor = "blue"
                                } else method = 'POST';
                                return (
                                    <Dropdown.Item key={"itm:"+course.name}>
                                        <button className={stylesheet.customBTN} style={{background: Bcolor, color: Vcolor}} key={course.name} onClick={postChoice(course.name, course.j_num, method)}>{mergedCourses(course.name+course.j_num)}</button>
                                    </Dropdown.Item>
                                    )

                            })
                        }

                    </DropdownButton>
                    {
                        sortedGroupedArr.map(category => {
                            if(!excludedCategories.includes(category[0])){
                                return (
                                    <DropdownButton className={stylesheet.customDdb} key={category[0]} title={mapCategory(category[0])}>
                                        {
                                            category[1].map(course => {
                                                if(!excluded.includes(course.yht)){
                                                    let method = "";
                                                    let Vcolor = "black"
                                                    let Bcolor = "white"
                                                    if(choiceName.includes(course.yht)){
                                                        method = 'DELETE';
                                                        Vcolor = "white"
                                                        Bcolor = "blue"
                                                    } else method = 'POST';
                                                    return (
                                                        <Dropdown.Item key={'itm: '+course.yht}>
                                                            <button className={stylesheet.customBTN} style={{background: Bcolor, color: Vcolor}} key={course.yht} onClick={postChoice(course.name, course.j_num, method)}>{mergedCourses(course.yht)}</button>
                                                        </Dropdown.Item>
                                                    )
                                                }
                                            })
                                        }
                                    </DropdownButton>
                                )
                            }

                            }
                        )
                    }
                </Col>
                <Col className={stylesheet.resCol}>
                    <button className={stylesheet.delBTN} onClick={deleteAllChoices}>Poista kaikki valinnat</button>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Jakso</th>
                                <th>Palkki</th>
                                <th>Kurssi</th>
                            </tr>
                        </thead>
                        <tbody>
                        {userChoices.map(choice => {
                            return (
                                <tr key={choice.id}>
                                    <td>{choice.period}</td>
                                    <td>{choice.column}</td>
                                    <td>{mergedCoursesRes(choice.name+choice.j_num, choice.s_num)}</td>
                                </tr>
                            )
                        })}
                        </tbody>

                    </Table>

                </Col>
            </Row>


        </div>

    )
}

export default Kone;