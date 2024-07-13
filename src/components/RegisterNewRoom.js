import React, { useState } from 'react';
import { z } from 'zod';
import * as S from './RegisterNewRoom.styled';


const roomTypeEnum = z.enum(["Select","Standard", "Deluxe", "Suite", "ICU", "Operating", "Emergency"]);


const roomSchema = z.object({
  roomName: z.string()
    .min(3, {message:"Room Name must be at least 3 characters long"})
    .max(20,{message: "Room Name must not exceed 20 characters"})
    .regex(/^[a-zA-Z\s-]+$/, "Room Name can only contain letters, spaces, and hyphens"),

  roomType: roomTypeEnum,
  
  roomId: z.string()
    .regex(/^[A-Z]{1}-\d{3}$/,{message: "Room ID must be in the format 'A-123' "} ),

  floorName: z.string()
    .min(1, {message:"Floor Name is required"})
    .max(10, {message:"Floor Name must not exceed 10 characters"}),

  extensionNumber: z.string()
    .regex(/^\d{2,4}$/,{message:"Extension Number must be between 3 to 5 digits"} ),

  patientOccupyingBedCapacity: z.number()
    .int({message:"Bed Capacity must be a integer number"})
    .min(1,{message:"Bed Capacity must be at least 1"} )
    .max(10, {message:"Bed Capacity must not exceed 10"}),
});

function RegisterNewRoom() {
  
  const [formData, setFormData] = useState({
    roomName: '',
    roomType: 'Select',
    roomId: '',
    floorName: '',
    extensionNumber: '',
    patientOccupyingBedCapacity: 1,
  });
  const [errors, setErrors] = useState({});

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'patientOccupyingBedCapacity' ? Number(value) : value
    }));
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const validatedData = roomSchema.parse(formData);
      console.log(validatedData);
      setErrors({});
      alert("Room registered successfully!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <S.RegisterNewRoom>
      <S.Title>Register New Room</S.Title>
      <form onSubmit={handleSubmit}>
        <S.FormGroup>
          <S.Label htmlFor="roomName">Room Name</S.Label>
          <S.Input
            type="text"
            id="roomName"
            name="roomName"
            value={formData.roomName}
            onChange={handleChange}
            placeholder="Enter the room name"
          />
          <p>Enter the name of the room as everyone calls it.</p>
          {errors.roomName && <S.Error>{errors.roomName}</S.Error>}
        </S.FormGroup>

        <S.FormGroup>
          <S.Label htmlFor="roomType">Room Type</S.Label>
          <S.Select
            id="roomType"
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
          >
            {roomTypeEnum.options.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </S.Select>
          <p>Select the pre-defined room type.</p>
          {errors.roomType && <S.Error>{errors.roomType}</S.Error>}
        </S.FormGroup>

        <S.FormGroup>
          <S.Label htmlFor="roomId">Room ID</S.Label>
          <S.Input
            type="text"
            id="roomId"
            name="roomId"
            value={formData.roomId}
            onChange={handleChange}
            placeholder="Enter room ID"
          />
          <p>Enter the room identification number, typically a room number.</p>
          {errors.roomId && <S.Error>{errors.roomId}</S.Error>}
        </S.FormGroup>

        <S.FormGroup>
          <S.Label htmlFor="floorName">Floor Name</S.Label>
          <S.Input
            type="text"
            id="floorName"
            name="floorName"
            value={formData.floorName}
            onChange={handleChange}
            placeholder="Enter floor label"
          />
          <p>Enter the floor name, like 'ground floor' or 'first floor'.</p>
          {errors.floorName && <S.Error>{errors.floorName}</S.Error>}
        </S.FormGroup>

        <S.FormGroup>
          <S.Label htmlFor="extensionNumber">Extension Number</S.Label>
          <S.Input
            type="text"
            id="extensionNumber"
            name="extensionNumber"
            value={formData.extensionNumber}
            onChange={handleChange}
            placeholder="Enter room extension number"
          />
          {errors.extensionNumber && <S.Error>{errors.extensionNumber}</S.Error>}
        </S.FormGroup>

        <S.FormGroup>
          <S.Label htmlFor="patientOccupyingBedCapacity">Patient Occupying Bed Capacity</S.Label>
          <S.Input
            type="number"
            id="patientOccupyingBedCapacity"
            name="patientOccupyingBedCapacity"
            value={formData.patientOccupyingBedCapacity}
            onChange={handleChange}
            placeholder="Enter the bed capacity number"
            min="1"
            max="10"
          />
          <p>Enter the number of beds allowed in that room for patient occupancy.</p>
          {errors.patientOccupyingBedCapacity && <S.Error>{errors.patientOccupyingBedCapacity}</S.Error>}
        </S.FormGroup>

        <S.CreateRoomButton type="submit">Create Room</S.CreateRoomButton>
      </form>
    </S.RegisterNewRoom>
  );
}

export default RegisterNewRoom;
