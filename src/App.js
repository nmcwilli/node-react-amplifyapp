import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { API, Storage, Auth } from 'aws-amplify';
import { Helmet } from "react-helmet"; // Import Helmet
import {
  Button,
  Flex,
  Heading,
  Image,
  Text,
  TextAreaField,
  TextField,
  View,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import { 
  listNotes  
} from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";


const App = ({ signOut }) => {
  const [notes, setNotes] = useState([]); 
  const [isExpanded, setIsExpanded] = useState(false); // Track whether Notes expanded 
  const [editingNoteId, setEditingNoteId] = useState(null); // Track the note being edited

  /* Fetch the notes */
  useEffect(() => {
    fetchNotes();
  }, []);

  // Function to handle inline note editing
  const handleNoteEdit = (noteId) => {
    setEditingNoteId(noteId);
  };

  // Function to handle saving the edited note
  const handleNoteSave = async (noteId) => {
    // Implement your logic to save the edited note content to the server if needed
    setEditingNoteId(null); // Stop editing mode after saving
  };

  /* Toggle expansion */
  const toggleExpansion = () => {
    setIsExpanded((prevExpanded) => !prevExpanded);
  };

  /* Fetch all the notes for the current authenticated user */
  async function fetchNotes() {
    try {
      // Check if the user is authenticated
      const user = await Auth.currentAuthenticatedUser();

      // Fetch notes from the API
      const apiData = await API.graphql({ query: listNotes });
      const notesFromAPI = apiData.data.listNotes.items;

      // Filter the notes to only include those created by the current user
      const userNotes = notesFromAPI.filter(note => note.owner === user.username);

      // Fetch image URLs for notes that have images
      await Promise.all(
        userNotes.map(async (note) => {
          if (note.image) {
            const url = await Storage.get(note.name);
            note.image = url;
          }
          return note;
        })
      );

      setNotes(userNotes);
    } catch (error) {
      // Handle any errors that occur during the fetch
      console.error('Error fetching notes:', error);
    }
  }

  /* Create note function */
  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const image = form.get("image");
    const data = {
      name: form.get("name"),
      description: form.get("description"),
      image: image.name,
    };
  
    try {
      // Get the currently authenticated user
      const user = await Auth.currentAuthenticatedUser();
  
      // Set the owner field to the user's username
      data.owner = user.username;
  
      // Upload the image if available
      if (!!data.image) await Storage.put(data.name, image);
  
      // Create the note using the API
      await API.graphql({
        query: createNoteMutation,
        variables: { input: data },
      });
  
      // Fetch updated notes and reset the form
      fetchNotes();
      event.target.reset();
    } catch (error) {
      console.error('Error creating note:', error);
    }
  }

  /* Delete note function */
  async function deleteNote({ id, name }) {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    await Storage.remove(name);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }

  return (
    <>
      {/* Set the page title using Helmet */}
      <Helmet>
        <title>Simple Notes App</title>
      </Helmet>

      <View className="App">
        <br />
        <Heading level={1}>Simple Notes</Heading>
        <br />
        <button onClick={toggleExpansion}>
          {isExpanded ? 'Stop adding new note' : 'Add new note'}
        </button>
        {isExpanded && (
          <View as="form" margin="3rem 0" onSubmit={createNote}>
            <div className="expanded-view">
              <Flex direction="column" justifyContent="center">
                <TextField
                  name="name"
                  placeholder="Note Title"
                  label="Note Name"
                  style={{ width: '100%', textAlign: 'left' }}
                  className="Text-input-name"
                  labelHidden
                  variation="quiet"
                  required
                />
                <TextAreaField
                  name="description"
                  placeholder="Note Description"
                  label="Note Description"
                  style={{ flex: 1, textAlign: 'left' }}
                  className="Text-area-note"
                  labelHidden
                  variation="quiet"
                  rows={8}
                  required
                />
                <div>
                  <View
                    name="image"
                    as="input"
                    type="file"
                    style={{ flex: 1 }}
                  />
                </div>
                <div>
                  <Button 
                    type="submit" 
                    style={{ flex: 1 }}
                    className="Submit-button"
                    variation="primary">
                    Create Note
                  </Button>
                </div>
              </Flex>
            </div>
          </View>
        )}
        <br />
        <Heading level={2}><br />My Notes</Heading>
        <View className="notes-container" margin="3rem 0">
          {notes.map((note) => (
            <div className="note-container" key={note.id || note.name}>
              <Flex
                direction="column"
                justifyContent="center"
                alignItems="center"
                onClick={() => handleNoteEdit(note.id)} // Enable editing mode on click
              >
                <Text as="strong" fontWeight={700}>
                  {editingNoteId === note.id ? ( // Render editable content if in editing mode
                    <TextField
                      name="name"
                      defaultValue={note.name}
                      // Add appropriate TextField props and styles for editing
                    />
                  ) : (
                    // Render normal text if not in editing mode
                    note.name
                  )}
                </Text>
                <Text as="span">
                  {editingNoteId === note.id ? ( // Render editable content if in editing mode
                    <TextAreaField
                      name="description"
                      defaultValue={note.description}
                      // Add appropriate TextAreaField props and styles for editing
                    />
                  ) : (
                    // Render normal text if not in editing mode
                    note.description
                  )}
                </Text>
                {note.image && (
                  <Image
                    src={note.image}
                    alt={`visual aid for ${note.name}`}
                    style={{ width: 400 }}
                  />
                )}
                <Button variation="link" onClick={() => deleteNote(note)}>
                  [x]
                </Button>
                {editingNoteId === note.id && ( // Show Save button when in editing mode
                  <Button variation="primary" onClick={() => handleNoteSave(note.id)}>
                    Save
                  </Button>
                )}
              </Flex>
            </div>
          ))}
        </View>
        <Button onClick={signOut}>Sign Out</Button>
      </View>

    </>
  );
};

export default withAuthenticator(App);