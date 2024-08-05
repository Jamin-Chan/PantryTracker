'use client'

import { firestore } from "@/firebase";
import { Box, Button, Stack, Typography, Grid, TextField, Fab, } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Firestore } from "firebase/firestore";
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { Nanum_Myeongjo } from "next/font/google";
import { useEffect, useState} from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "/firebase.js";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 3
}


export default function Pantry() {
    const [pantry, setPantry] = useState([])
    const [searchQuery, setSearchQuery] = useState(""); 

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const[itemName, setItemName] = useState('')

    const updatePantry = async () => {
        const snapshot = query(collection(firestore,'pantry'))
        const docs = await getDocs(snapshot)
        const pantryList = []
        docs.forEach((doc) => {
        pantryList.push({name: doc.id, ...doc.data()})
        })
        console.log(pantryList)
        setPantry(pantryList)
    }
    
    useEffect(() => {  
        updatePantry()
    }, [])

    const addItem = async (item) => {
        const docRef = doc(collection(firestore, 'pantry'), item)
        //check if it exists
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()){
        const {count} = docSnap.data()
        await setDoc(docRef, {count: count + 1})
        await updatePantry()
        return
        } else{
        await setDoc(docRef, {count: 1})
        }

        await updatePantry()
    }
    
    const removeItem = async (item) => {
        const docRef = doc(collection(firestore, 'pantry'), item)
        const docSnap = await getDoc(docRef)
        if(docSnap.exists()) {
        const {count} = docSnap.data()
        if(count == 1){
            await deleteDoc(docRef)
        } else {
            await setDoc(docRef, {count: count - 1})
        }
        }
        await updatePantry()
    }

    const filteredSearch = pantry.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box >
            <Box>
                <Box 
                    width={"100vw"} 
                    height={"10%" } 
                    position={"absolute"} 
                    padding={3} 
                    display={'flex'} 
                    justifyContent={"space-between"}
                    justifyItems={"stretch"}
                    flexDirection={"row"}
                    zIndex={99}
                >
                    <Typography variant={'h4'} color={'#333'}>
                    🛒 Pantry Tracker
                    </Typography>
                    <TextField
                        justifyContent="center"
                        variant="outlined"
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        inputProps={{ style: { backgroundColor: "white" } }}
                        sx={{ width: "400px" }}
                    />
                    <Box display={"flex"} alignItems={"center"} columnGap={2}>
                        <TextField
                            variant="outlined"
                            placeholder="Add items..."
                            value={itemName} 
                            inputProps={{ style: { backgroundColor: "white" } }}
                            onChange={(e) => setItemName(e.target.value)}
                        />
                        <Button variant="contained"
                            sx={{ height: "100%" }}
                            onClick={() => {
                            addItem(itemName)
                            setItemName('')
                            }}
                        >
                            Add
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Box width={"100vw"} 
                height={"20vh"} 
                display={'flex'} 
                bgcolor={"#85ffbc"}
                justifyContent={'center'}
                justifyItems={"center"}
                alignItems={'end'}
            >
                <Typography variant={'h2'} color={'#333'} paddingRight={2}>
                    Pantry Items
                </Typography>
            </Box>
            <Box width={"100vw"}
                minHeight={"100vh"}
                flexDirection={'row'} 
                display={'flex'} 
                bgcolor={"#85ffbc"}
                justifyContent={'center'}
                alignItems={'start'}
            >
                <Grid container 
                    spacing={2} 
                    padding={10} 
                    gap={5}
                    justifyContent={"start"}
                >
                    {filteredSearch.map(({name, count}) => (
                    <Box 
                        key={name}
                        width="250px" 
                        height="250px" 
                        display={'flex'} 
                        flexDirection={'column'}
                        justifyContent={'space-between'} 
                        alignItems={'center'}
                        bgcolor={'#f0f0f0'}
                        padding={4}
                        borderRadius={"25px"}
                        boxShadow={"5px 10px 5px black"}
                        overflow={"hidden"}
                    > 
                        <Typography
                        variant={'h4'}
                        color={'#333'}
                        textAlign={'center'}
                        >
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                        </Typography>

                        <Typography
                        variant={'h5'}
                        color={'#333'}
                        textAlign={'center'}
                        >
                        Amount: {count}
                        </Typography>
                        <Box display={'flex'} 
                            flexDirection={'row'}
                            columnGap={2}
                        >
                            <Fab color="primary" aria-label="add"
                                onClick={() => addItem(name)}
                            >
                                <AddIcon />
                            </Fab>
                            <Fab color="secondary" aria-label="add"
                                onClick={() => removeItem(name)}
                            >
                                <RemoveIcon />
                            </Fab>
                                                        
                        </Box>
                        
                    </Box>
                    ))}
                </Grid>
            </Box>
        </Box>
    )
}