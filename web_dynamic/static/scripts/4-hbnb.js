$(document).ready(() => {
  // Create an object to store selected amenities with their IDs
  const amenityObj = {};

  // Listen for changes on checkboxes inside the amenities popover
  $('.amenities .popover input').change(function () {
    // Check if the checkbox is checked
    if ($(this).is(':checked')) {
      // Add the amenity to the object with its ID
      amenityObj[$(this).attr('data-name')] = $(this).attr('data-id');
    } else if ($(this).is(':not(:checked)')) {
      // Remove the amenity from the object if unchecked
      delete amenityObj[$(this).attr('data-name')];
    }

    // Get the names of selected amenities and sort them
    const names = Object.keys(amenityObj).sort();

    // Update the h4 tag with the sorted list of amenity names
    $('.amenities h4').text(names.join(', '));
  });

  // Event listener for the search button click
  $('button').click(function () {
    // Get the list of selected amenities IDs
    const amenityIds = Object.values(amenityObj);

    // Make a POST request to the server with the list of amenity IDs
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      contentType: 'application/json',
      data: JSON.stringify({ amenities: amenityIds }),
      success: function (data) {
        // Clear the existing places
        $('.places').empty();

        // Loop through the places in the response and create article tags
        data.places.forEach((place) => {
          // Remove the "Owner" tag from the description
          const description = place.description.replace('<b>Owner:</b> ', '');

          // Create the article element
          const article = `
            <article>
              <div class="title_box">
                <h2>${place.name}</h2>
                <div class="price_by_night">${place.price_by_night}</div>
              </div>
              <div class="information">
                <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
              </div>
              <div class="description">
                ${description}
              </div>
            </article>
          `;

          // Append the article to the places section
          $('.places').append(article);
        });
      },
      error: function (error) {
        console.error('Error:', error);
      },
    });
  });
});
