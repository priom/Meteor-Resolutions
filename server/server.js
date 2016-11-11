import { Meteor } from 'meteor/meteor';

// mongo collection: resolutions
Resolutions = new Mongo.Collection('resolutions');

Meteor.startup(() => {
  // code to run on server at startup
});

// securely access records
Meteor.publish("resolutions", function() {
    // show records only to owner or not public
    return Resolutions.find({
        owner: this.userId
    });
});

Meteor.methods({
    // securely add record to db and attach to user
    addResolution: function(title) {
        // find one record from mongo db
        // var res = Resolutions.findOne(id);
        // throw error if not owner
        // if(res.owner != Meteor.userId()) {
        //     throw new Meteor.Error('not-authorized');
        // }

        Resolutions.insert({
            title: title,
            createdAt: new Date(),
            owner: Meteor.userId()
        })
    },
    // securely update record in db
    updateResolution: function(id, checked) {
        // find one task from mongo db
        var res = Resolutions.findOne(id);
        // throw error if not owner
        if(res.owner != Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        Resolutions.update(id, {$set: {checked: checked}});
    },
    // securely delete record from db
    deleteResolution: function(id) {
        // find one task from mongo db
        var res = Resolutions.findOne(id);
        // throw error if not owner
        if(res.owner != Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        Resolutions.remove(id);
    },
    // private tasks method
    setPrivate: function(id, private) {
        // find one task from mongo db
        var res = Resolutions.findOne(id);
        // throw error if not owner
        if(res.owner != Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        // update record when prive
        Resolutions.update(id, {$set: {private: private}});
    }
});
