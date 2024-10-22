const sendBtn = document.querySelector('#send');
const medicine = document.querySelector('#medicine');
const producer = document.querySelector('#producer');
const storage = document.querySelector('#storage');
const expiration = document.querySelector('#expiration');
const comment = document.querySelector('#comment');

let link = '';

sendBtn.addEventListener('click', function() {
  
  if (medicine.value && producer.value && storage.value && expiration.value && comment.value) {
    const data = {
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

      const htmlLink = document.createElement('p');
      htmlLink.innerHTML = `<a href="${link}">Invite link</a>`;
      document.body.appendChild(htmlLink);
    })
  } else {
    console.log('type in the inputs');
  }
});
