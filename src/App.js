import React, {useEffect, useState} from "react";
import Tarjotin from "./tarjotin";
import Kone from "./kone"
import jwt_decode from "jwt-decode";
import store from "./store"

import stylesheet from "./css/stylesheet.module.css"
import 'bootstrap/dist/css/bootstrap.min.css'

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


function App(props) {

  const [user, setUser] = store.useState("user", {default: ""});

  const [page, setPage] = useState(<Kone />);

  const [userName, setUserName] = useState("");

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const changePage = (e) => {
    if(e.target.value === 'kone'){
        setPage(<Kone />)
    } else {
        setPage(<Tarjotin />)
    }
  }



  /*function checkSub(sub, email) {
    fetch('https://api.kurssivalitsin.com/user/read.php?user='+sub)
        .then(res => {
          if(res == "404"){
            try {
              let res = fetch('https://api.kurssivalitsin.com/user/create.php', {
                method: 'POST',
                body: JSON.stringify({
                  id: Number(sub),
                  email: email
                }),
              });
              let resJson = res.json();
              if(res.status === 200) {
                setUser(sub)
              }
            }catch (err) {
              console.log(err)
            }
          } else {
            setUser(sub)
          }
        })

    console.log(sub);
  }*/


  function handleCallbackResponse(response) {
    //console.log("Encoded JWT ID token: " + response.credential);
    var userObject = jwt_decode(response.credential);
    //console.log(userObject.sub)
    const sub = userObject.sub.substring(userObject.sub.length-9);

    const getUserRes = function (){
      fetch('https://api.kurssivalitsin.com/user/read.php?user='+sub)
          .then(res => res.json())
          .then(data => {
            console.log(data);
            if(Number(data) === 404){
              console.log("voivittu");
              fetch('https://api.kurssivalitsin.com/user/create.php', {
                method: 'POST',
                body: JSON.stringify({
                  id: Number(sub),
                  email: userObject.email
                }),
              })
                  .then(res => {
                    if(res.status === 200){
                      setUser(sub);
                      setUserName(userObject.email)
                    } else {
                      console.log(res)
                    }
                  })
            } else {
              setUser(sub);
              setUserName(userObject.email)
            }
          })
    }
    getUserRes();



    //console.log(userObject)

    document.getElementById("loginScreen").hidden = true
  }

  function handleSigOut(event) {
    //setGlobalState("user",{});
    store.remove("user", () => { });
    document.getElementById("loginScreen").hidden = false;
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "938683517315-neer58nr3ksmqkqogjiv7o8g9val5nc7.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });
    google.accounts.id.renderButton(
        document.getElementById("signInDiv"),
        {theme: "outline", size: "large"}
    )
  },[]);

  //console.log(user);

  return (

      <div className="App">

        <div className={stylesheet.loginScreen} id="loginScreen">
          <div className={stylesheet.loginWrapper}>
            <h1 className={stylesheet.signInLogo}>Kurssivalitsin</h1>
            <p>Kirjaudu alta sisään edu.vihti.fi -loppuisella tililläsi.</p>
            <div className={stylesheet.signInDiv} id="signInDiv"></div>
          </div>
        </div>

        {

          Object.keys(user).length !== 0 &&
            <div>

              <div className={stylesheet.topnav}>

                <div className={stylesheet.navLeft}>
                  <button value={"kone"} onClick={ (e) => changePage(e)}>Kone</button>
                  <button value={"tarjotin"} onClick={ (e) => changePage(e)}>Tarjotin</button>

                  <button onClick={handleShow}>?</button>

                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Apua?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <p>1. Tarkat ohjeet käyttöön <a href="https://docs.google.com/document/d/1OVx74C7F9W_KeVPyHKa11J3VteA6RYkTxJ3euIlA2ak/edit?usp=sharing" target="_blank">täältä</a>.</p>
                      <p>2. Valitse haluamasi kurssit.</p>
                      <p>3. Kurssikone -sivulla voit valita kurssit, jotka kone järjestää automaattisesti.</p>
                      <p>4. Jos kone antaa ilmoituksen <b>"Valintasi ei mahtunut"</b> älä hätiköi. Katso toimenpiteet tähän 1. kohdan ohjeista kohdasta 5.</p>
                      <p>5. Kurssitarjotin -sivulla näet valitsemasi kurssit kurssitarjottimessa, jossa voit myös vaihtaa niiden paikkoja.</p>
                      <p>6. <b>HUOM!</b> Tarjottimessa tallennetut muutokset häviävät, jos valitset kurssikone -näkymästä lisää kursseja. <b>Muokkaa siis tarjotinta viimeiseksi.</b></p>
                      <p>7. Muista siirtää valintasi Wilmaan!</p>
                      <p>8. Ongelmatilanteissa lue huolella kohtaan 1 linkattu laajempi ohje.</p>
                      <p>9. Jos ohjeet eivät vastanneet kysymyksiisi yhteyttä voi ottaa sähköpostiin <a href="mailto:apu@kurssivalitsin.com?Subject=Tuki" target="_top"><strong>apu@kurssivalitsin.com</strong></a></p>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button onClick={handleClose}>Sulje</Button>
                    </Modal.Footer>
                  </Modal>
                </div>
                <div className={stylesheet.navRight}>
                  <p>{"Logged in as " + userName}</p>
                  <button onClick={ (e) => handleSigOut(e)}>Sign out</button>
                </div>

              </div>
              {
                page
              }
            </div>


        }




      </div>

  );
}

export default App;
