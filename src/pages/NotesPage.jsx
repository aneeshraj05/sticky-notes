import React from 'react'
import { fakeData as notes } from '../assets/fakeData.js'
import NoteCard from '../components/NoteCard.jsx'

const NotesPage = () => {
  return (
    <div id='app'>
      {
        notes.map((note)=>{
          return <NoteCard key={note.$id} note={note} />
        })
      }
      
    </div>
  )
}

export default NotesPage
