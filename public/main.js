const sendBtn = document.querySelector('#send');
const medicine = document.querySelector('#medicine');
const producer = document.querySelector('#producer');
const storage = document.querySelector('#storage');
const expiration = document.querySelector('#expiration');
const comment = document.querySelector('#comment');

let link = '';
let i = 1;
let data;
const alert = document.createElement('div');

function sendData() {
  data = {
    medicine: medicine.value,
    producer: producer.value,
    storage: storage.value,
    expiration: expiration.value,
    comment: comment.value,
  };

  fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: data }),
  })
  .then(res => res.json())
  .then(result => {
    link = result.link;

    const container = document.querySelector('.container');
    const htmlLink = document.createElement('p');

    alert.classList.remove('alert-danger');
    alert.classList.add('alert', 'alert-primary');
    alert.innerText = 'Link was created.';
    htmlLink.innerHTML = `<a href="${link}">Open</a>`;
    htmlLink.classList.add('link-text');

    container.append(alert, htmlLink);
    setTimeout(() => Delete(alert), 1500);
  });
}

function Delete(div) {
    div.remove();
}

sendBtn.addEventListener('click', function() {
  const container = document.querySelector('.container');

  if (medicine.value && producer.value && storage.value && expiration.value && comment.value) {
    if (i >= 2) {
      if (medicine.value === data.medicine && producer.value === data.producer && storage.value === data.storage && expiration.value === data.expiration && comment.value === data.comment) {
        console.log(1, i);
        alert.classList.add('alert', 'alert-danger');
        alert.innerText = 'You have already sent this data.';

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

        fetch('/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: data }),
        })
        .then(res => res.json())
        .then(result => {
          link = result.link;

          const container = document.querySelector('.container');
          const htmlLink = document.createElement('p');

          alert.classList.remove('alert-danger');
          document.querySelector('.link-text').remove();
          alert.classList.add('alert', 'alert-primary', 'mb-2');
          alert.innerText = 'Link was created.';
          htmlLink.innerHTML = `<a href="${link}">Open</a>`;
          htmlLink.classList.add('link-text');

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
    alert.classList.add('alert', 'alert-danger');
    alert.innerText = 'Please full in inputs.';

    container.appendChild(alert);
    setTimeout(() => Delete(alert), 3000);
  }
});
