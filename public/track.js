/**
 * EnrollIQ Tracking Snippet
 * Embed on school websites via:
 * <script src="https://app.enrolliq.com/track.js" data-school-id="school_abc" data-api-key="phc_xxx"></script>
 */
(function () {
  'use strict';

  var script = document.currentScript;
  var schoolId = script && script.getAttribute('data-school-id');
  var apiKey = script && script.getAttribute('data-api-key');

  if (!apiKey) {
    console.warn('[EnrollIQ] Missing data-api-key attribute on track.js script tag');
    return;
  }

  // Load PostHog JS SDK from CDN (latest snippet)
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group identify setPersonProperties setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags resetGroups onFeatureFlags addFeatureFlagsHandler onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

  // Initialize PostHog
  posthog.init(apiKey, {
    api_host: 'https://us.i.posthog.com',
    autocapture: false,
    capture_pageview: true,
    capture_pageleave: true,
    persistence: 'localStorage+cookie',
  });

  // Register school_id as a super property on all events
  if (schoolId) {
    posthog.register({ school_id: schoolId });
  }

  // --- Scroll Depth Tracking ---
  var scrollThresholds = [25, 50, 75, 100];
  var firedThresholds = {};

  function getScrollPercent() {
    var docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    var winHeight = window.innerHeight;
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (docHeight <= winHeight) return 100;
    return Math.round((scrollTop / (docHeight - winHeight)) * 100);
  }

  function checkScroll() {
    var pct = getScrollPercent();
    for (var i = 0; i < scrollThresholds.length; i++) {
      var threshold = scrollThresholds[i];
      if (pct >= threshold && !firedThresholds[threshold]) {
        firedThresholds[threshold] = true;
        posthog.capture('scroll_depth_reached', {
          depth: threshold,
          page_path: window.location.pathname,
          school_id: schoolId,
        });
      }
    }
  }

  window.addEventListener('scroll', checkScroll, { passive: true });

  // Reset scroll tracking on SPA navigation
  var lastPath = window.location.pathname;
  function resetScrollOnNavigation() {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      firedThresholds = {};
      pageStartTime = Date.now();
    }
  }
  setInterval(resetScrollOnNavigation, 1000);

  // --- Time on Page ---
  var pageStartTime = Date.now();

  window.addEventListener('beforeunload', function () {
    var duration = Math.round((Date.now() - pageStartTime) / 1000);
    posthog.capture('time_on_page', {
      duration_seconds: duration,
      page_path: window.location.pathname,
      school_id: schoolId,
    });
  });

  // --- Form Interception for Identity Stitching ---
  function handleFormCapture(form) {
    if (!form || form.tagName !== 'FORM') return;

    var emailInput = form.querySelector(
      'input[type="email"], input[name="email"], input[name*="email" i]'
    );
    var firstNameInput = form.querySelector(
      'input[name="first_name" i], input[name="firstname" i], input[name*="first" i]:not([name*="email" i])'
    );
    var lastNameInput = form.querySelector(
      'input[name="last_name" i], input[name="lastname" i], input[name="surname" i], input[name*="sur" i], input[name*="last" i]:not([name*="email" i])'
    );
    var nameInput = form.querySelector(
      'input[name="name"], input[name="full_name" i], input[name="fullname" i], input[name*="name" i]:not([name*="email" i]):not([name*="child" i]):not([name*="first" i]):not([name*="sur" i]):not([name*="last" i])'
    );
    var childNameInput = form.querySelector(
      'input[name="child_name" i], input[name="childName" i], input[name*="child" i]'
    );
    var yearGroupSelect = form.querySelector(
      'select[name="year_group" i], select[name="yearGroup" i], select[name*="year" i]'
    );

    var email = emailInput ? emailInput.value.trim() : null;
    var firstName = firstNameInput ? firstNameInput.value.trim() : null;
    var lastName = lastNameInput ? lastNameInput.value.trim() : null;
    var name = firstName && lastName
      ? (firstName + ' ' + lastName)
      : (firstName || lastName || (nameInput ? nameInput.value.trim() : null));
    var childName = childNameInput ? childNameInput.value.trim() : null;
    var yearGroup = yearGroupSelect ? yearGroupSelect.options[yearGroupSelect.selectedIndex].text : null;
    if (yearGroup && yearGroup.toLowerCase().includes('select')) yearGroup = null;

    if (email) {
      var personProps = {
        email: email,
        name: name || undefined,
        school_id: schoolId,
      };
      if (childName) personProps.child_name = childName;
      if (yearGroup) personProps.year_group = yearGroup;

      // Identity stitching: link anonymous session to real person
      posthog.identify(email, personProps);

      posthog.capture('enquiry_form_submitted', {
        email: email,
        name: name || undefined,
        child_name: childName || undefined,
        year_group: yearGroup || undefined,
        school_id: schoolId,
        page_path: window.location.pathname,
      });
    }
  }

  function interceptForms() {
    // Native form submit (standard forms)
    document.addEventListener('submit', function (e) {
      handleFormCapture(e.target);
    });

    // Button[type=button] click inside a form (AJAX/JS-driven forms)
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('button[type="button"], input[type="button"]');
      if (btn) {
        var form = btn.closest('form');
        if (form) handleFormCapture(form);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', interceptForms);
  } else {
    interceptForms();
  }
})();
