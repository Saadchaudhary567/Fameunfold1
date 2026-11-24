import {initializeApp} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {getAuth,createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {getFirestore,doc,setDoc,getDoc,serverTimestamp} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import {firebaseConfig} from "./firebase-config.js";

const ADMIN_EMAIL="admin@fameunfold.com";
const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);
const btn=document.getElementById("setupBtn"),msg=document.getElementById("msg"),pass=document.getElementById("setupPass");

// Basic starting settings only. Add your own products, articles, categories and text from admin.html.
const defaults={
  heroTitle:"Discover Fameunfold.\nExplore More Every Day.",
  heroSubtitle:"Helpful guides, practical product ideas and useful recommendations, all in one place.",
  heroImage:"",
  aboutTitle:"About Fameunfold",
  aboutText:"Fameunfold is an editorial-style website with helpful guides and practical recommendations.",
  contactEmail:"",
  theme:"sage",font:"modern",
  categories:[],
  social:{facebook:"",instagram:"",youtube:""},
  profilePhoto:""
};

btn.onclick=async()=>{
  const password=pass.value;
  if(password.length<8){msg.textContent="Password must be at least 8 characters.";return}
  btn.disabled=true;msg.textContent="Setting up...";
  try{
    const main=await getDoc(doc(db,"siteContent","main"));
    if(main.exists())throw Error("Setup already completed. Use admin login.");
    const cred=await createUserWithEmailAndPassword(auth,ADMIN_EMAIL,password);
    await setDoc(doc(db,"admins",cred.user.uid),{role:"owner",email:ADMIN_EMAIL,createdAt:serverTimestamp()});
    await setDoc(doc(db,"siteContent","main"),{...defaults,setupComplete:true});
    msg.innerHTML="<b>Setup complete!</b> Log in at admin.html with your email and password. Now delete setup.html and setup.js from GitHub.";
    btn.remove();pass.remove();
  }catch(e){msg.textContent=e.message;btn.disabled=false}
};
