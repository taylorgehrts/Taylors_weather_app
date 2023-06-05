var apiKey = "89af5f7a4a50fd2c28874bd71ce48ff7";

// Wait for the document to be ready
$(document).ready(function() {
    // Add a click event listener to the search button
    $('button[type="submit"]').click(function(event) {
      event.preventDefault(); // Prevent form submission
  
      // Log a message to the console when the button is clicked
      console.log('Button clicked!');
    });
  });
  