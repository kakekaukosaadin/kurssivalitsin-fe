import {useEffect, useState} from "react";
import store from "./store";
import stylesheet from "./css/stylesheet.module.css"


function Tarjotin() {
    const [courses, setCourses] = useState([]);
    const [calculatedCourses, setCalculatedCourses] = useState([]);
    const [highLighted, setHighLighted] = useState([]);

    const [user, setUser] = store.useState("user")

    const deleteAllChoices = function () {
        fetch('https://api.kurssivalitsin.com/calculated_course/all.php?user='+user, {
            method: 'DELETE'
        })
            .then(res => {
                setCalculatedCourses(getUserChoices())
            })
    }

    useEffect(() => {
        fetch('https://api.kurssivalitsin.com/courses.php', {
            method: 'GET'
        }).then(res => res.json())
            .then(data => setCourses(data));
        getUserChoices();
    }, []);

    const getUserChoices = function (){
        fetch('https://api.kurssivalitsin.com/calculated_course/read.php?user='+user, {
            method: 'GET'
        }).then(res => res.json())
            .then(data => setCalculatedCourses(data));
        return calculatedCourses
    };

    const postChoice = function (course_id, method) {
        return function () {
            if(method === 'POST') {
                fetch('https://api.kurssivalitsin.com/calculated_course/create.php', {
                    method : 'POST',
                    body: JSON.stringify({
                        course_id: Number(course_id),
                        user_id: Number(user)
                    }),
                })
                    .then(res => res.json())
                    .then(data => {
                        setCalculatedCourses(getUserChoices())
                    })
                setHighLighted([])
            } else {
                fetch('https://api.kurssivalitsin.com/calculated_course/delete.php', {
                    method: 'DELETE',
                    body: JSON.stringify({
                        course_id: Number(course_id),
                        user_id: Number(user)
                    }),
                })
                    .then(res => res.json())
                    .then(data => {
                        setCalculatedCourses(getUserChoices())
                    });

                    const thisCourse = calculatedCourses.filter(course => {
                        return course.id === course_id
                    })
                const sameCourses = courses.filter(course => {
                    return course.name === thisCourse[0].name && course.j_num === thisCourse[0].j_num
                }).map(course => course.id);


                setHighLighted(sameCourses);
                //console.log(sameCourses)
            }
        }
    }

    function groupArrayOfObjects(list, key) {
        return list.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }

    //let reducedCourseList = courses.map(({id, period, column, name, j_num, s_num}) => {
    //    return {id, period, column, name, j_num, s_num}
    //})

    let groupedByPeriod = groupArrayOfObjects(courses, "period");
    let groupedByPeriodArr = Object.entries(groupedByPeriod);

    let calculatedIDs = calculatedCourses.map(course => course.id);

    //console.log(groupedByPeriodArr);

    function mergedCourses(yht, snum) {
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
        else if(yht === "AI232") {return "AI2."+snum+" & AI3."+snum}
        else if(yht === "AI57") {return "AI5."+snum+" & AI7."+snum}
        else if(yht === "AI572") {return "AI5."+snum+" & AI7."+snum}
        else if(yht === "AI68") {return "AI6."+snum+" & AI8."+snum}
        else if(yht === "AI682") {return "AI6."+snum+" & AI8."+snum}
        else return yht+"."+snum
    }

    const excluded = []

    return (
        <div className="Tarjotin">
            {groupedByPeriodArr.map(period => {
                return (
                    <div key={'period'+period[0]}>
                        <h3 key={'periodname'+period[0]}><b>{'Jakso: '+period[0]}</b></h3>
                        {
                            Object.entries(groupArrayOfObjects(period[1], "column")).map(column => {
                                return (
                                    <div key={'column'+column[0]}>
                                        <p key={'column'+column[0]}>{'Palkki: '+column[0]}</p>
                                        {
                                            column[1].map(course => {
                                                if(!excluded.includes(course.name+course.j_num)){
                                                    let method = "";
                                                    let Vcolor = "black";
                                                    let Bcolor = "white"
                                                    if(calculatedIDs.includes(course.id)){
                                                        method = 'DELETE';
                                                        Vcolor = "white";
                                                        Bcolor = "blue"
                                                    } else if(highLighted.includes(course.id)){
                                                        method = 'POST';
                                                        Bcolor = "yellow"
                                                    } else {method = 'POST'}
                                                    return (
                                                        <button className={stylesheet.customBTN} style={{color: Vcolor, background: Bcolor}} key={course.id} onClick={postChoice(course.id, method)}>{mergedCourses(course.name+course.j_num, course.s_num)}</button>
                                                    )
                                                }

                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            })}
            <button className={stylesheet.tarjotinDelBTN} onClick={deleteAllChoices}>Poista kaikki valinnat</button>
        </div>
    )

}

export default Tarjotin;