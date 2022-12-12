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
    const policy = form.elements['policy'].value * 1;

    if (!collection_symbol) {
      alert('Collection symbol is required');
      return;
    }

    if (policy !== 0 && !policy) {
      alert('Policy is required');
      return;
    }

    if (policy < 0 || policy > 100) {
      alert('Policy must be between 0 and 100');
      return;
    }

    await createRoom({
      collection_symbol,
      policy,
    });

    const roomURL = document.getElementById('room-url');
    roomURL.style.display = 'block';
    const roomURLLink = roomURL.querySelector('a');
    roomURLLink.href = `${window.location.origin}/rooms/${collection_symbol}`;
    roomURLLink.innerText = `${window.location.origin}/rooms/${collection_symbol}`;
  });
});
