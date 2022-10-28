let participantNumber = 1;

const participantsDiv = document.getElementById('participants');

const add = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.className = 'mb-3';

  const input = document.createElement('input');
  input.type = 'text';
  input.setAttribute('name', `participant${participantNumber}`);
  input.setAttribute('class', 'form-control');
  input.setAttribute('placeholder', 'Participant Name');

  const removeButton = document.createElement('button');
  removeButton.innerHTML = 'X';
  removeButton.type = 'button';
  removeButton.setAttribute('class', 'btn btn-danger remove-participant-button');
  removeButton.onclick = () => {
    participantsDiv.removeChild(container);
  };

  const lineBreak = document.createTextNode('\r\n');
  container.appendChild(input);
  container.appendChild(removeButton);
  container.appendChild(lineBreak);
  participantsDiv.appendChild(container);

  participantNumber += 1;
};
