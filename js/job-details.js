document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title');
    const company = urlParams.get('company');
    const description = urlParams.get('description');
    const experience = urlParams.get('experience');
    const location = urlParams.get('location');
    const postedOn = urlParams.get('posted_on');
    const jobLink = urlParams.get('job_link');  // Assuming the job link is passed as a query parameter
    // Add more fields as needed

    document.getElementById('job-details').innerHTML = `
        <h2>${title} at ${company}</h2>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Experience:</strong> ${experience}</p>
        <p><strong>Posted on:</strong> ${postedOn}</p>
        <p><strong>Description:</strong></p>
        <p>${formatDescription(description)}</p>
        <a href="${jobLink}" class="apply-button" target="_blank">Apply Now</a>
    `;

    function formatDescription(description) {
        return description.replace(/\. /g, '.<br>');
    }
});
