import React from "react"
import './index.scss'

class PostForm extends React.Component {
    state = {
        title: '',
        username: '',
        content: '',
        error: null,
        status: null,
        count: 0,
    }

    charLimit = 128
    statusTimer = 2000

    render(){
        return (
            <div className="post-form-ctn">
                <h1 className="post-title">Make a post</h1>
                
                <form className="post-form" onSubmit={(e)=>{
                    e.preventDefault()

                    if(this.state.count > this.charLimit){
                        this.setState({
                            status: 'Too long',
                            error: 'Content too long'
                        })
                        setTimeout(()=>this.setState({
                            status: null,
                            error: null,
                        }), this.statusTimer)
                        return
                    }

                    fetch(`${process.env.REACT_APP_BACKEND}/posts`,{
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            title: this.state.title,
                            username: this.state.username,
                            content: this.state.content
                        })
                    })
                    .then(resp => {
                        if(resp.status != 200){
                            return resp.text()
                        } else {
                            this.setState({
                                title: '',
                                username: '',
                                content: '',
                                count: 0
                            })

                            this.props.postHandler()
                            this.setState({status: 'Sent'})
                            setTimeout(()=> this.setState({status: null}), this.statusTimer)

                            return null
                        }
                    })
                    .then(message => {
                        if(message){
                            throw new Error(message)
                        }
                    })
                    .catch(error => {
                        this.setState({
                            status: 'Unable to post right now',
                            error: true 
                        })
                        console.log(error)
                    })
                }}>
                    <input className="title" type="text" placeholder="Title" required value={this.state.title} onChange={(e)=>{
                        this.setState({title: e.target.value})
                    }}/>
                    <input className="username" type="text" placeholder="username" required value={this.state.username} onChange={(e)=>{
                        this.setState({username: e.target.value})
                    }}/>
                    <textarea className="content" value={this.state.content} required onChange={(e)=>{
                        this.setState({
                            content: e.target.value,
                            count: e.target.value.length
                        })
                    }}/>
                    <div className="submit-ctn">
                        <button className="submit" type="submit" value="submit">Post</button>
                        <p className={
                            `post-status ${this.state.status ? 'status-visible' : null} ${this.state.error ? 'post-error' : null}`
                            }>{this.state.status}</p>
                    </div>
                    <p className="count">{this.state.count}/{this.charLimit}</p>
                </form>
            </div>
        )
    }
}

export default PostForm