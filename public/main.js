const sendBtn = document.querySelector("#send");
const medicine = document.querySelector("#medicine");
const producer = document.querySelector("#producer");
const storage = document.querySelector("#storage");
const expiration = document.querySelector("#expiration");
const comment = document.querySelector("#comment");

let link = "";
let i = 1;
let data;
const alert = document.createElement("div");
const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
if (day < 10) {
  expiration.value = `${year}-${month}-0${day}`;
} else {
  expiration.value = `${year}-${month}-${day}`;
}

function sendData() {
  data = {
    medicine: medicine.value,
    producer: producer.value,
    storage: storage.value,
    expiration: expiration.value,
    comment: comment.value,
  };

  fetch("/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: data }),
  })
    .then((res) => res.json())
    .then((result) => {
      link = result.link;
      medicine.value = "";
      producer.value = "";
      storage.value = "";
      expiration.value = "";
      comment.value = "";

      const container = document.querySelector(".container");
      const sendContainer = document.querySelector(".send-container");
      const passContainer = document.querySelector(".pass-container");

      const htmlLink = document.createElement("p");
      const password = document.querySelector(".pass");
      const showBtn = document.createElement("button");
      const copyBtn = document.createElement("button");

      let passwordData = "123456789";

      password.innerText = "Editing Password: *********";
      showBtn.innerText = "Show";
      showBtn.classList.add("btn", "btn-outline-dark");
      copyBtn.innerText = "Copy to Clipboard";
      copyBtn.classList.add("btn", "btn-dark");

      function clear(el, text) {
        el.innerText = text;
      }

      let check = true;
      showBtn.addEventListener("click", function () {
        if (check) {
          password.innerText = "Editing Password: " + passwordData;
          check = false;
        } else {
          password.innerText = "Editing Password: *********";
          check = true;
        }
      });
      copyBtn.addEventListener("click", function () {
        navigator.clipboard.writeText("Your Editing Password: " + passwordData);
        copyBtn.innerText = "Copied to Clipboard";
        setTimeout(() => clear(copyBtn, "Copy to Clipboard"), 1500);
      });

      alert.classList.remove("alert-danger");
      alert.classList.add("alert", "alert-primary", "mt-4");
      alert.innerText = "Link was created.";
      htmlLink.innerHTML = `<a href="${link}">Open Invite Link</a>`;
      htmlLink.classList.add("link-text", "mt-2");

      sendContainer.appendChild(htmlLink);
      container.append(alert);
      passContainer.append(showBtn, copyBtn);
      setTimeout(() => Delete(alert), 1500);
    });
}

function Delete(div) {
  div.remove();
}

sendBtn.addEventListener("click", function () {
  const container = document.querySelector(".container");

  if (
    medicine.value &&
    producer.value &&
    storage.value &&
    expiration.value &&
    comment.value
  ) {
    if (i >= 2) {
      if (
        medicine.value === data.medicine &&
        producer.value === data.producer &&
        storage.value === data.storage &&
        expiration.value === data.expiration &&
        comment.value === data.comment
      ) {
        console.log(1, i);
        alert.classList.add("alert", "alert-danger", "mt-4");
        alert.innerText = "You have already sent this data.";

        container.appendChild(alert);
        setTimeout(() => Delete(alert), 3000);
      } else {
        data = {
          medicine: medicine.value,
          producer: producer.value,
          storage: storage.value,
          expiration: expiration.value,
          comment: comment.value,
        };

        fetch("/api", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: data }),
        })
          .then((res) => res.json())
          .then((result) => {
            link = result.link;

            const container = document.querySelector(".container");
            const htmlLink = document.createElement("p");

            alert.classList.remove("alert-danger");
            document.querySelector(".link-text").remove();
            alert.classList.add("alert", "alert-primary", "mb-2");
            alert.innerText = "Link was created.";
            htmlLink.innerHTML = `<a href="${link}">Open</a>`;
            htmlLink.classList.add("link-text");

            container.append(alert, htmlLink);
            setTimeout(() => Delete(alert), 1500);
          });
      }
    } else {
      console.log(2, i);
      sendData();
      i++;
    }
  } else {
    alert.classList.add("alert", "alert-danger");
    alert.innerText = "Please full in inputs.";

    container.appendChild(alert);
    setTimeout(() => Delete(alert), 3000);
  }
});


