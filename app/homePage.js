
BPMS.Services.Utils.checkLoginStatus();
$(function () {
   var owl = $("#owl-demo");
   owl.owlCarousel({
      autoPlay: 5000,
      singleItem: true,
      autoHeight: true,
      pagination: false,
      transitionStyle: "fadeUp"
   });

   owl = $("#owl-demo1");
   owl.owlCarousel({
      autoPlay: 5000,
      singleItem: true,
      autoHeight: true,
      pagination: false,
      transitionStyle: "goDown"
   });

   owl = $("#owl-demo2");
   owl.owlCarousel({
      autoPlay: 6000,
      singleItem: true,
      autoHeight: true,
      pagination: false,
      transitionStyle: "goDown"
   });

   ko.applyBindings(new window.BPMS.ViewModels.HomeViewModel());
})
