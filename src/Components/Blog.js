//Blogging App using FIREBASE
import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useState, useRef, useEffect } from "react";
import {db} from '../firebase-init';

export default function Blog(){

    const [formData, setformData] = useState({title:"", content:""})
    const [blogs, setBlogs] =  useState([]);
    
    const titleRef = useRef(null);

    useEffect(() => {
        titleRef.current.focus();
    },[]);

    useEffect(() => {
        
        console.log("Runs on Blogs Mount/Update!!");
        if (blogs.length && blogs[0].title) {
          document.title = blogs[0].title;
        } else {
          document.title = "No blogs!";
        }

      }, [blogs]);

  // READING FROM THE DATABASE
      useEffect(() => {
        const docRef = collection(db,"posts");

        getDocs(docRef).then((snapShot) => {
            const blogs = snapShot.docs.map((doc) =>{
                return{
                    id: doc.id,
                    ...doc.data()
                }

            })
            console.log('postsID: ',blogs);
            setBlogs(blogs);
           
        })

      },[]);
      
    function handleSubmit(e){
        e.preventDefault();

        setBlogs([{title: formData.title,content:formData.content}, ...blogs]);
        // ADDING TO THE DATABASE
        addDoc(collection(db,"posts"),{
          title: formData.title,
          content: formData.content,
          createAt: new Date()

      });
        
        setformData({title:"", content:""});
        //Setting focus on title after adding a blog
        titleRef.current.focus();       
    }

    function removeBlog(i){

        setBlogs( blogs.filter((blog)=> blog.id !== i));
        //DELETING FROM THE DATABASE
        const docRef = doc(collection(db,"posts"),i);
        deleteDoc(docRef);
 
     }

    return(
        <>
        <h1>Write a Blog!</h1>
        <div className="section">

        {/* Form for to write the blog */}
            <form onSubmit={handleSubmit}>
                <Row label="Title">
                        <input className="input"
                                placeholder="Enter the Title of the Blog here.."
                                value={formData.title}
                                ref = {titleRef}
                                onChange = {(e) => setformData({title: e.target.value, content:formData.content})}
                        />
                </Row >

                <Row label="Content">
                        <textarea className="input content"
                                placeholder="Content of the Blog goes here.."
                                value={formData.content}
                                onChange = {(e) => setformData({title: formData.title,content: e.target.value})}
                        />
                </Row >
         
                <button className = "btn">ADD</button>
            </form>
                     
        </div>

        <hr/>

        {/* Section where submitted blogs will be displayed */}
        <h2> Blogs </h2>
        {blogs.map((blog) => (
            <div className="blog">
                <h3>{blog.title}</h3>
                <hr/>
                <p>{blog.content}</p>

                <div className="blog-btn">
                  {console.log("inside remove: ", blog.id)}
                        <button onClick={() => {
                            removeBlog(blog.id)
                        }}
                        
                        className="btn remove">

                            Delete

                        </button>
                </div>
            </div>
        ))}
        
        </>
        )
    }

//Row component to introduce a new row section in the form
function Row(props){
    const{label} = props;
    return(
        <>
        <label>{label}<br/></label>
        {props.children}
        <hr />
        </>
    )
}
