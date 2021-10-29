const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

exports.addLike = functions.firestore
    .document("/post/{creatorId}/userPost/{postId}/likes/{userId}")
    .onCreate((snap, context) => {
      return db.collection("post")
          .doc(context.params.creatorId)
          .collection("userPost")
          .doc(context.params.postId)
          .update({
            likesCount: admin.firestore.FieldValue.increment(1),
          });
    });


exports.removeLike = functions.firestore
    .document("/post/{creatorId}/userPost/{postId}/likes/{userId}")
    .onDelete((snap, context) => {
      return db.collection("post")
          .doc(context.params.creatorId)
          .collection("userPost")
          .doc(context.params.postId)
          .update({
            likesCount: admin.firestore.FieldValue.increment(-1),
          });
    });


