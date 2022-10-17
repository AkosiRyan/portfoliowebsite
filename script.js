// navigation menu
(() =>{

    const hamburgerBtn = document.querySelector(".hamburger-btn"),
    navMenu = document.querySelector(".nav-menu"),
    closeNavBtn = document.querySelector(".close-nav-menu");

    hamburgerBtn.addEventListener("click", showNavMenu);
    closeNavBtn.addEventListener("click", hideNavMenu);

    function showNavMenu(){
        navMenu.classList.add("open");
        bodyScrollingToggle();
    }

    function hideNavMenu(){
        navMenu.classList.remove("open");
        fadeOutEffect();
        bodyScrollingToggle();
    }

    function fadeOutEffect(){
        document.querySelector(".fade-out-effect").classList.add("active");
        setTimeout(() =>{
            document.querySelector(".fade-out-effect").classList.remove("active");
        },300)
    }
    
    // attach an event handler to document
    document.addEventListener("click", (event) =>{
        if(event.target.classList.contains('link-item')){

            // make sure event.target.hash has a value before overriding default behavior
            if(event.target.hash !==""){

                // prevent default anchor click behavior
                event.preventDefault();
                const hash = event.target.hash;

                // deactivate existing active 'section'
                document.querySelector(".section.active").classList.add("hide");
                document.querySelector(".section.active").classList.remove("active");

                // activate new 'section'
                document.querySelector(hash).classList.add("active");
                document.querySelector(hash).classList.remove("hide");

                // deactivate existing active navigation menu 'link-item'
                navMenu.querySelector(".active").classList.add("outer-shadow","hover-in-shadow");
                navMenu.querySelector(".active").classList.remove("active","inner-shadow");

                // if clicked 'link-item' is contained within the navigation menu
                if(navMenu.classList.contains("open")){
                    // activate new navigation menu 'link-item'
                    event.target.classList.add("active", "inner-shadow");
                    event.target.classList.remove("outer-shadow", "hover-in-shadow");

                    // hide navigation menu
                    hideNavMenu();
                }
                else{
                    let navItems = navMenu.querySelectorAll(".link-item");
                    navItems.forEach((item) =>{
                        if(hash === item.hash){
                            // activate new navigation menu 'link-item' 
                            item.classList.add("active", "inner-shadow");
                            item.classList.remove("outer-shadow", "hover-in-shadow");
                        }
                    })
                    fadeOutEffect();
                }
                // add hash (#) to url
                window.location.hash = hash;
            }
        }
    })
})();

// about section tabs
(()=> {
   const aboutSection = document.querySelector(".about-section"),
   tabsContainer = document.querySelector(".about-tabs");

   tabsContainer.addEventListener("click",(event) => {
    // if event.target contains 'tab-item' class and not contains 
    // 'active' class 
    if(event.target.classList.contains("tab-item") &&
    !event.target.classList.contains("active")){
        // console.log("event.target contains 'tab-item' class and not contains 'active' class");
        // console.log(event.target);
        const target = event.target.getAttribute("data-target");
        // console.log(target);
        // deactivate existing active 'tab-item'
        tabsContainer.querySelector(".active").classList.remove("outer-shadow","active");
        // activate new 'tab-item'
        event.target.classList.add("active","outer-shadow");
        // deactivate existing active 'tab-content'
        aboutSection.querySelector(".tab-content.active").classList.remove("active");
        // activate new 'tab-content'
        aboutSection.querySelector(target).classList.add("active");
    }
   })
})();

function bodyScrollingToggle(){
    document.body.classList.toggle("hidden-scrolling");
}


// portfolio filter and popup

(() =>{

    const filterContainer = document.querySelector(".portfolio-filter"), portfolioItemsContainer = document.querySelector(".portfolio-items"), portfolioItems = document.querySelectorAll(".portfolio-item"), 
    popup = document.querySelector(".portfolio-popup"), 
    prevBtn = popup.querySelector(".pp-prev"), 
    nextBtn = popup.querySelector(".pp-next"),
    closeBtn = popup.querySelector(".pp-close"),
    projectDetailsContainer = popup.querySelector(".pp-details"),
    projectDetailsBtn = popup.querySelector(".pp-project-details-btn");
    let itemIndex, slideIndex, screenshots;

    // filter portfolio items
    filterContainer.addEventListener("click", (event)=>{
        // console.log(event.target);
        if(event.target.classList.contains("filter-item") && !event.target.classList.contains("active")){
            // deactivate existing active 'filter-item'
            filterContainer.querySelector(".active").classList.remove("outer-shadow","active");
            // activate new 'filter-item'
            event.target.classList.add("active","outer-shadow");
            const target = event.target.getAttribute("data-target");
            portfolioItems.forEach((item) =>{
                if(target == item.getAttribute("data-category") || target === 'all'){
                    item.classList.remove("hide");
                    item.classList.add("show");
                }
                else{
                    item.classList.remove("show");
                    item.classList.add("hide");
                }
            })
        }
    })

    portfolioItemsContainer.addEventListener("click", (event) =>{
        if(event.target.closest(".portfolio-item-inner")){
            const portfolioItem = event.target.closest(".portfolio-item-inner").parentElement;
            console.log(portfolioItem);
            // get the portfolioItem index
            itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(portfolioItem);
            screenshots = portfolioItems[itemIndex].querySelector(".portfolio-item-img img").getAttribute("data-screenshots");
            // convert screenshots into array
            screenshots = screenshots.split(",");
            if(screenshots.length === 1){
                prevBtn.style.display="none";
                nextBtn.style.display="none";
            }
            else{
                prevBtn.style.display="block";
                nextBtn.style.display="block";
            }
            slideIndex = 0;
            popupToggle();
            popupSlideshow();
            popupDetails();
        }
    })

    closeBtn.addEventListener("click", () =>{
        popupToggle();
        if(projectDetailsContainer.classList.contains("active")){
            popupDetailsToggle();
        }
    })

    function popupToggle(){
        popup.classList.toggle("open");
        bodyScrollingToggle();
    }

    function popupSlideshow(){
        const imgSrc = screenshots[slideIndex];
        const popupImg = popup.querySelector(".pp-img");
        // activate loader until the popupImg loaded
        popup.querySelector(".pp-loader").classList.add("active");
        popupImg.src = imgSrc;
        popupImg.onload = () =>{
        // deactivate loader after the popupimg loaded
        popup.querySelector(".pp-loader").classList.remove("active");
        }
        popup.querySelector(".pp-counter").innerHTML = (slideIndex+1) + " of " + screenshots.length;
    }

        // next slide
        nextBtn.addEventListener("click", () => {
            if(slideIndex === screenshots.length-1){
                slideIndex = 0;
            }
            else{
                slideIndex++;
            }
            popupSlideshow();
        })

        // prev slide
        prevBtn.addEventListener("click", () =>{
            if(slideIndex === 0){
                slideIndex = screenshots.length-1
            }
            else{
                slideIndex--;
            }
            popupSlideshow();
        })

        function popupDetails(){
            // if portfolio-item-details not exists
            if(!portfolioItems[itemIndex].querySelector(".portfolio-item-details")){
                projectDetailsBtn.style.display="none";
                return; 
                // end function execution
            }
            projectDetailsBtn.style.display="block";
            // get the project details
            const details = portfolioItems[itemIndex].querySelector(".portfolio-item-details").innerHTML;
            // set the project details
            popup.querySelector(".pp-project-details").innerHTML = details;
            // get the project title
            const title = portfolioItems[itemIndex].querySelector(".portfolio-item-title").innerHTML;
            // set the project title
            popup.querySelector(".pp-title h2").innerHTML = title;
            // get the project category
            const category = portfolioItems[itemIndex].getAttribute("data-category");
             // set the project category
            popup.querySelector(".pp-project-category").innerHTML = category.split("-").join(" ");
        }
        projectDetailsBtn.addEventListener("click",() =>{
            popupDetailsToggle();
        })

        // popup project details
        function popupDetailsToggle(){
            if(projectDetailsContainer.classList.contains("active")){
                projectDetailsBtn.querySelector("i").classList.remove("fa-minus");
                projectDetailsBtn.querySelector("i").classList.add("fa-plus");
                projectDetailsContainer.classList.remove("active");
                projectDetailsContainer.style.maxHeight = 0 + "px";
            }
            else{
                projectDetailsBtn.querySelector("i").classList.remove("fa-plus");
                projectDetailsBtn.querySelector("i").classList.add("fa-minus");
                projectDetailsContainer.classList.add("active");
                projectDetailsContainer.style.maxHeight 
                = projectDetailsContainer.scrollHeight + "px";
                popup.scrollTo(0,projectDetailsContainer.offsetTop);
            }
        }
})();

// hide all sections except active

//   (() =>{
//       const sections = document.querySelectorAll(".section");
//       sections.forEach((section) =>{
//          if(!section.classList.contains("active")){
//               section.classList.add("hide");
//           }
//      })
//   })();


// theme light and dark mode
const dayNight = document.querySelector(".day-night");

    dayNight.addEventListener("click", ()=>{
        document.body.classList.toggle("dark");
        if(document.body.classList.contains("dark")){
            localStorage.setItem("theme", "dark");
        }
        else{
            localStorage.setItem("theme", "light");
        }
        updateIcon();
    })
    function themeMode(){
        // checking if 'theme' key exists
        if(localStorage.getItem("theme") !== null){
            if(localStorage.getItem("theme") === "light"){
                document.body.classList.remove("dark");
            }
            else{
                document.body.classList.add("dark");
            }
        }
        updateIcon();
    }
    themeMode();
    function updateIcon(){
        if(document.body.classList.contains("dark")){
            dayNight.querySelector("i").classList.remove("fa-moon");
            dayNight.querySelector("i").classList.add("fa-sun");
        }
        else{
            dayNight.querySelector("i").classList.remove("fa-sun");
            dayNight.querySelector("i").classList.add("fa-moon");
        }
    }

    window.addEventListener("load", () =>{
        // preloader
        document.querySelector(".preloader").classList.add("fade-out");
        setTimeout(() =>{
            document.querySelector(".preloader").style.display="none";
        },6000)
    })

    // typing text animation script
    var typed = new Typed(".typing", {
        strings: ["Web Designer", "Web Developer"],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true
    });

    $(document).ready(function(){
    $(window).scroll(function(){
        
        // sticky navbar on scroll script
        if(this.scrollY > 20){
            $('.header').addClass("sticky");
        }else{
            $('.header').removeClass("sticky");
       }
       
        // scroll-up button show/hide script
       if(this.scrollY > 500){
           $('.scroll-up-btn').addClass("show");
        }else{
            $('.scroll-up-btn').removeClass("show");
        }
    })});
    
   // slide-up script     
   $('.scroll-up-btn').click(function(){         
       $('html').animate({scrollTop: 0});         
       // removing smooth scroll on slide-up button click
       $('html').css("scrollBehavior", "auto");
   });

    $('.navbar .menu li a').click(function(){
        // applying again smooth scroll on menu items click
       $('html').css("scrollBehavior", "smooth");
   });