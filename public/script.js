function createRoom(data) {
  return fetch('/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('create-room');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const collection_link = form.elements['collection-symbol'].value;
    const collection_symbol = collection_link.split('/').pop();

    if (!collection_symbol) {
      alert('Collection symbol is required');
      return;
    }

    await createRoom({
      collection_symbol,
      policy: 0,
    });

    const roomURL = document.getElementById('room-url');
    roomURL.style.display = 'block';
    const roomURLLink = roomURL.querySelector('a');
    roomURLLink.href = `${window.location.origin}/rooms/${collection_symbol}`;
    roomURLLink.innerText = `${window.location.origin}/rooms/${collection_symbol}`;
  });
});
