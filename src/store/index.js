import { createStore } from 'vuex';
import firebase from 'firebase/app';
import router from '@/router';
import { db, auth } from "@/firebase";

export default createStore({
  // application-level data
  state: {
    user: auth.currentUser,    // firebase auth user
    isSideNavCollapsed: true,             // bool to check if sidenav is showing
    isLoading: true,                     // bool to keep track whether user is being retreived from the DB
    user_data: null,                      // user data pulled from db
    user_image: null,
    events: [],
    talent:[],
    mentors: [],
  },

  // functions that affect the state
  mutations: {

    SET_IS_SIDE_NAV_COLLAPSED(state) {
      state.isSideNavCollapsed = !state.isSideNavCollapsed;
    },

    SET_AUTH_USER(state) {
      state.isLoading = true;
      // listening for changes to user auth
      auth.onAuthStateChanged(user => {
        if (user) {
          state.user = user;
          // save the last login in the db
          db.collection("users").doc(auth.currentUser.uid).set({
            last_login: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
          // fetch the user data
          this.commit('FETCH_CURRENT_USER_DATA_FROM_DB');
          state.isLoading = false;
        } else {
          state.user = null;
          state.isLoading = false;
          router.push({ name: 'Home' });
        }
      })
    },

    SET_USER(state, user) {
      auth
        .signInWithEmailAndPassword(user.email, user.password)
        .then(() => {
          // authenticated successfully
          router.push({ name: 'Home' });
        })
        .catch((ex) => {
          //catching errors and display them
          alert(ex.message);
        });
    },

    SIGNUP_USER(_, user) {
      auth
        .createUserWithEmailAndPassword(user.email_id, user.password)
        .then(() => {
          //signed up successfully  
          router.push({ name: 'Profile' });
          // writing user to db
          db.collection("users").doc(auth.currentUser.uid).set({
            created_at: firebase.firestore.FieldValue.serverTimestamp(),
            id: auth.currentUser.uid,
            first_name: user.first_name,
            last_name: user.last_name,
            full_name: user.first_name + " " + user.last_name,
            image_url: "https://firebasestorage.googleapis.com/v0/b/eureka-development-860d4.appspot.com/o/default-user-image.png?alt=media&token=a3a39904-b0f7-4c56-8e76-353efa9b526b",
            background: "",
            bio: "",
            interests: [],
            experience_level: 0,
            roles: [user.role],    // TODO: retrieve this from the signup form
            social_links: {
              email_id: user.email_id,
              github_url: "",
              linkedin_url: "",
              website_url: "",
            }
          });
        })
        .catch((ex) => {
          //catching errors and display them
          alert(ex.message);
        });
    },

    FETCH_CURRENT_USER_DATA_FROM_DB(state){
      db.collection("users").doc(auth.currentUser.uid)
        .get()
        .then(function(doc) {
          if (doc.exists) {
            state.user_data = doc.data();
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
    },

    GET_EVENTS(state){
      db.collection("events")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            state.events.push(doc.data());
          });
        })
        .catch(function(error) {
          alert("Error getting document:", error);
        });
    },
    
    GET_TALENT(state){
      db.collection("users")
        .where("id", "!=", auth.currentUser.uid)
        .where("roles", "array-contains", "talent")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            state.talent.push(doc.data());
          });
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
    },

    GET_MENTORS(state){
      db.collection("users")
        .where("id", "!=", auth.currentUser.uid)
        .where("roles", "array-contains", "mentor")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            state.mentors.push(doc.data());
          });
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
    },

    SEND_FEEDBACK(_, feedback) {
      // writing feedback to db
      db.collection("feedbacks").add({
        id: auth.currentUser.uid,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        subject: feedback.subject,
        message: feedback.message
      })
      .then(() => {
        alert("Thank you! Your feedback is well received!")
      })
      .catch((error) => {
        alert(error);
      });
    },

  },


  // functions to be called throughout the app that, in turn, call mutations
  actions: {
    
    toggleSideNavState({ commit }) {
      commit('SET_IS_SIDE_NAV_COLLAPSED')
    },

    setAuthUser({ commit }) {
      commit('SET_AUTH_USER');
    },

    setUser({ commit }, user) {
      commit('SET_USER', user);
    },

    signUpUser({ commit }, user) {
      commit('SIGNUP_USER', user);
    },

    getEvents({ commit }) {
      commit('GET_EVENTS');
    },
    
    getTalent({ commit }) {
      commit('GET_TALENT');
    },
    
    getMentors({ commit }) {
      commit('GET_MENTORS');
    },

    sendFeedback({ commit }, feedback) {
      commit('SEND_FEEDBACK', feedback);
    }

  }

})