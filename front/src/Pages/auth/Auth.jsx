import axios from "axios";
import { useContext, useState } from "react";
import { windowCtx } from "../../App";

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function Auth() {
  const [traveler_name, setName] = useState("");
  const [password, setPwd] = useState("");
  const { csrf } = useContext(windowCtx);

  return (
    <form
      method="POST"
      onSubmit={(e) => {
        e.preventDefault();
        console.log(traveler_name)
        console.log(password)
        axios
          .post(
            "http://localhost:8000/users/register/",
            {
              traveler_name,
              password,
            },
            {
              headers: {
                "X-CSRFToken": getCookie("csrftoken"),
              },
              withCredentials: true,
            }
          )
          .then((res) => console.log(res.data));
      }}
    >
      <input
        name="traveler_name"
        id="traveler_name"
        type="text"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        name="password"
        id="password"
        type="password"
        onChange={(e) => setPwd(e.target.value)}
      />
      <button type="submit">submit</button>
      <h1 onClick={() => console.log(csrf.current)}>cookie</h1>
    </form>
  );
}

export default Auth;
