const sendBtn = document.querySelector('#send');
const medicine = document.querySelector('#medicine');
const producer = document.querySelector('#producer');
const storage = document.querySelector('#storage');
const expiration = document.querySelector('#expiration');
const comment = document.querySelector('#comment');

let link = '';
let i = 1;
let data;

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
    htmlLink.innerHTML = `<a href="${link}">Open</a>`;
    htmlLink.classList.add('link-text');
    container.appendChild(htmlLink);
  })
}

sendBtn.addEventListener('click', function() {
  if (medicine.value && producer.value && storage.value && expiration.value && comment.value) {
    if (i >= 2) {
      if (medicine.value === data.medicine && producer.value === data.producer && storage.value === data.storage && expiration.value === data.expiration && comment.value === data.comment) {
        alert('You have already sent this data');
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

          document.querySelector('.link-text').remove();
          const container = document.querySelector('.container');
          const htmlLink = document.createElement('p');
          htmlLink.innerHTML = `<a href="${link}">Open</a>`;
          htmlLink.classList.add('link-text');
          container.appendChild(htmlLink);
        })
      }
    } else {
        sendData();
      i++;
    }
  } else {
    console.log('type in the inputs');
  }
});
