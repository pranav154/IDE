window.addEventListener('DOMContentLoaded', function() {
  ace.require('ace/ext/language_tools');
  const editor = ace.edit("editor"); // Provide the ID of the container element
  
  editor.getSession().setMode("ace/mode/javascript"); // Set the desired programming language mode
  const inputEditor = ace.edit("input-container");
  inputEditor.getSession().setMode("ace/mode/text");
  const outputEditor = ace.edit("output-container");
  outputEditor.getSession().setMode("ace/mode/text");
  outputEditor.setReadOnly(true);

  editor.setTheme("ace/theme/twilight"); // Set the intial  theme
  inputEditor.setTheme("ace/theme/twilight"); 
  outputEditor.setTheme("ace/theme/twilight"); 

  // Additional configuration and feature setup
  editor.setOptions({
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true,
    wrap: true
  });

  editor.setOption("enableBasicAutocompletion", true);
  const outputElement = document.getElementById('output');

  // Set initial language
  const languageSelect = document.getElementById("languageSelect");
  const initialLanguage = languageSelect.value;
  setLanguageTemplate(initialLanguage);

  // change theme

  const themeSelect = document.getElementById("themeSelect");
  themeSelect.addEventListener('change', function() {
    const selectedTheme = themeSelect.value;
    editor.setTheme(`ace/theme/${selectedTheme}`);
    inputEditor.setTheme(`ace/theme/${selectedTheme}`);
    outputEditor.setTheme(`ace/theme/${selectedTheme}`);
  });

  // change font size
  const fontSizeInput = document.getElementById("fontSizeInput");
  fontSizeInput.addEventListener('change', function() {
    const fontSize = `${fontSizeInput.value}px`;
    editor.setFontSize(fontSize);
  });

  // // change background colour
  // const modeSelect = document.getElementById("modeSelect");
  // modeSelect.addEventListener('change', function() {
  //   const selectedMode = modeSelect.value;
  //   if (selectedMode === "dark") {
  //     document.body.classList.add('dark-mode');
  //     editor.setTheme("ace/theme/twilight");
  //     inputEditor.setTheme("ace/theme/twilight");
  //     outputEditor.setTheme("ace/theme/twilight");
  //   } else {
  //     document.body.classList.remove('dark-mode');
  //     editor.setTheme("ace/theme/github");
  //     inputEditor.setTheme("ace/theme/github");
  //     outputEditor.setTheme("ace/theme/github");
  //   }
  // });

  // Update code template when language selection changes
  languageSelect.addEventListener('change', function() {
    const selectedLanguage = languageSelect.value;
    if(selectedLanguage === "c++"){
      console.log('hii');
      selectedLanguage='c_cpp';
    }
    setLanguageTemplate(selectedLanguage);
  });

  // Function to set the language template
  function setLanguageTemplate(language) {
    const templateFile = `/templates/${language}.txt`; // Path to the language template file

    // Make an AJAX request to fetch the template file
    const xhr = new XMLHttpRequest();
    xhr.open("GET", templateFile, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const templateCode = xhr.responseText;
        editor.setValue(templateCode);
        editor.getSession().setMode(`ace/mode/${language}`);
      }
    };
    xhr.send();
  }

      // Code change event
  editor.getSession().on('change', function(e) {
    const code = editor.getValue();
    console.log(code); // Replace with desired code handling logic
  });

  // Keyboard shortcut example (Ctrl + F)
  editor.commands.addCommand({
    name: 'find',
    bindKey: { win: 'Ctrl-F', mac: 'Command-F' },
    exec: function(editor) {
    // Handle find functionality here
    }
  });

  // Code folding
  editor.getSession().setFoldStyle('markbeginend');
  editor.getSession().setUseWrapMode(true);

  // Find and replace
  editor.commands.addCommand({
    name: 'replace',
    bindKey: { win: 'Ctrl-H', mac: 'Command-Option-F' },
    exec: function(editor) {
      editor.execCommand('replace');
    }
  });

// Auto-completion
  editor.setOptions({
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true
  });

  // Get the "Run" button element
  const runButton = document.getElementById('runButton');

  // Add a click event listener to the "Run" button
  runButton.addEventListener('click', submitCode);

  // Function to handle the submission of code and input
  function submitCode() {
    const code = editor.getValue(); // Get the code from the editor
    const input = inputEditor.getValue(); // Get the input from the input field
    const language = document.getElementById('languageSelect').value; // Get the selected language

    // Create a request payload object
    const payload = {
      code: code,
      input: input,
      language: language
    };
    // Make an AJAX request to the server
    fetch('http://localhost:4040/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
      // Handle the response from the server

      outputEditor.setValue(data.output);
      console.log(data.output);
    })
    .catch(error => {
      // Handle any errors that occur during the request
      console.error('Error:', error);
    });
    }




});
