function createRoom(data) {
  return fetch(`/rooms`, {
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
    const collection_symbol = form.elements['collection-symbol'].value;
    const royalty = form.elements['royalty'].value * 1;
    const policy = form.elements['policy'].value * 1;

    if (!collection_symbol) {
      alert('Collection symbol is required');
      return;
    }

    if (royalty !== 0 && !royalty) {
      alert('Royalty is required');
      return;
    }

    if (policy !== 0 && !policy) {
      alert('Policy is required');
      return;
    }

    if (royalty < 0 || royalty > 10000) {
      alert('Royalty must be between 0 and 10000');
      return;
    }

    if (policy < 0 || policy > 10000) {
      alert('Policy must be between 0 and 10000');
      return;
    }

    await createRoom({
      collection_symbol,
      royalty,
      policy,
    });

    const roomURL = document.getElementById('room-url');
    const roomURLLink = roomURL.querySelector('a');
    roomURLLink.href = `${window.location.origin}/rooms/${collection_symbol}`;
    roomURLLink.innerText = `${window.location.origin}/rooms/${collection_symbol}`;
    roomURL.style.display = 'block';
  });
});
