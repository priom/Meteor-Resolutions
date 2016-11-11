import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import './body.html';

// mongo collection: resolutions
Resolutions = new Mongo.Collection('resolutions');
// securely access records
Meteor.subscribe("resolutions");

// body: helpers
Template.body.helpers({
    resolutions: function() {
        if (Session.get('hideFinished')) {
            // show only items that aren't checked
            return Resolutions.find({checked: {$ne: true}});
        } else {
            return Resolutions.find();
        }
    },
    hideFinished: function() {
        return Session.get('hideFinished');
    }
});

// body: events
Template.body.events({
    // form submit
    'submit .new-resolution': function(event) {
        var title = event.target.title.value;
        // add record to db
        Meteor.call("addResolution", title);
        // clear form after submit
        event.target.title.value = "";

        return false;
    },
    // hide if checked
    'change .hide-finished': function(event) {
        Session.set('hideFinished', event.target.checked);
    }
});

// resolution template helpers
Template.resolution.helpers({
    isOwner: function() {
        return this.owner === Meteor.userId();
    }
});

// resolution template events
Template.resolution.events({
    // checked function
    'click .toggle-checked': function () {
        Meteor.call("updateResolution", this._id, !this.checked);
    },
    // delete function
    'click #delete': function() {
        // remove from db
        Meteor.call("deleteResolution", this._id);
    },
    // private/public button
    'click .toggle-private': function() {
        Meteor.call("setPrivate", this._id, !this.private);
    }
});

// modify accounts fields
// Accounts.ui.config({
//     passwordSignupFields: "USERNAME_ONLY"
// });
