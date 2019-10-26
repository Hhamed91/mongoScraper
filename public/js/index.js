// get all the scraped jobs from database Job collection
$.getJSON("/jobs", function (data) {
    if (data.length > 0) { // if database has jobs
        $("#no-jobs").css("display", "none"); // don't display #no-jobs div

        for (var i = 0; i < data.length; i++) { // build a card to display each job
            var div1 = $("<div>").addClass("row job");
            var div2 = $("<div>").addClass("col s12");
            var div3 = $("<div>").addClass("card teal");
            var div31 = $("<div>").addClass("card-content white-text");
            var jobLink = $("<a>").attr("href", data[i].link);
            var span = $("<span>").addClass("card-title white-text").text(data[i].title);
            jobLink.append(span);
            var p = $("<p>").text(data[i].summary);
            div31.append(jobLink, p);
            var div32 = $("<div>").addClass("card-action");
            var saveJobBtn = $("<a>").addClass("save-job-btn red waves-effect waves-light btn").attr("data-jobid", data[i]._id).text("Save Job");
            div32.append(saveJobBtn);
            div3.append(div31, div32);
            div2.append(div3);
            div1.append(div2);
            $("#jobs").append(div1);
        }
    } else { // if no job in database, display #no-jobs div
        $("#no-jobs").css("display", "block");
    }
});

$("#scrape-btn").click(function () {
    $.get("/scrape", function (data) {
        location.reload();
    })
})

$("#clear-btn").click(function () {
    $.ajax({
      url: "/jobs",
      type: "DELETE",
      success: function (data) {
        location.reload();
      }
    });
  })


  // when click Save Job, grab that Job from Job collection then add/insert to SavedJob collection
$(document).on("click", ".save-job-btn", function () {
    var jobID = $(this).attr("data-jobid");
  
    $.post("/save/" + jobID, function (data) {
      if (data === "Job already saved") {
  
        show_modal("modal-already-saved");
        setTimeout(function () { hide_modal("modal-already-saved"); }, 3000);
  
      } else if (data == "Job saved") {
  
        show_modal("modal-saved");
        setTimeout(function () { hide_modal("modal-saved"); }, 3000);
  
      }
    })
  })

  function show_modal(modalID) {
    $('#' + modalID).modal();
    $('#' + modalID).modal('open');
  }
  
  function hide_modal(modalID) {
    $('#' + modalID).modal('close');
  }