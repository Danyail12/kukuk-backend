import PocketGarrage from "../models/pocketGarrage.js";
import { User } from "../models/users.js";
import Expert from "../models/expert.js";
// import P0ocketGarrage from "../models/pocketGarrage.js";




export const createPocketGarrage = async (req, res) => {
    try {
        // Extract relevant data from the request body
        const {
             description, expires, carBrand, carModel, year, certificates,
            carImages, Registration, InspectionCertificates,TÜVInspectionCertificate,
            historyFile, ownershipHistory, invoicesBill,
            AdditionalPhotos, additionalDocuments
        } = req.body;

        // Check if the user exists
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if the expert exists using req.body.id
        // const expert = await Expert.findById(req.body._id);
        // if (!expert) {
        //     return res.status(404).json({ success: false, message: 'Expert not found' });
        // }

        // Save PocketGarrage as a standalone document
        const pocket = new PocketGarrage({
          description, expires, carBrand, carModel, year, certificates,
          carImages, Registration, InspectionCertificates,TÜVInspectionCertificate,
          historyFile, ownershipHistory, invoicesBill,
          AdditionalPhotos, additionalDocuments,
            // expert: expert._id
        });

        await pocket.save();

        // Save PocketGarrage for User
        user.pocketGarrage.push({
           pocketGarrage:pocket,
           user:user
        });
        await user.save();

        // Save PocketGarrage for Expert
        // expert.pocketGarrage.push({
        //     name, email, description, expires, carBrand, carModel, year, certificates,
        //     carImages, Registration, InspectionCertificates,
        //     historyFile, ownershipHistory, invoicesBill,
        //     AdditionalPhotos, additionalDocuments
        // });
        // await expert.save();

        res.status(201).json({
            success: true,
            message: 'car added successfully',
            pocket: pocket,
          });
        } catch (error) {
          console.error('Error adding pocket garrage:', error);
          res.status(500).json({ success: false, message: 'Something went wrong' });
        }
      }
      export const PocketGarrageBookedExpert = async (req, res) => {
        try {
          // Find the user
          const user = await User.findById(req.user._id);
          if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
          }
      
          // Find the expert
          const expert = await Expert.findById(req.body._id);
          if (!expert) {
            return res.status(404).json({ success: false, message: 'Expert not found' });
          }
      
          // Find the pocket garage
          const pocket = await PocketGarrage.findById(req.params.id);
          if (!pocket) {
            return res.status(404).json({ success: false, message: 'Pocket garage not found' });
          }
      
          // Remove the existing pocket garage entry from the user's array if it exists
          const existingPocketIndex = user.pocketGarrage.findIndex(item => item.pocketGarrage._id.equals(pocket._id));
          if (existingPocketIndex !== -1) {
            user.pocketGarrage.splice(existingPocketIndex, 1);
          }
      
          // Add the new pocket garage entry with the expert object to the user's array
          user.pocketGarrage.push({
            pocketGarrage: pocket,
            expertId: expert,
            user: user, // Include user's information here
          });
      
          // Save the changes to the user
          await user.save();
      
          // Update the expert's pocket garage with user's data
          expert.pocketGarrage.push({
            pocketGarrage: pocket,
            user: user, // Include user's information here
          });
          await expert.save();
      
          // Respond with success message
          res.status(200).json({ success: true, message: 'Pocket garage booked successfully' });
        } catch (error) {
          console.error('Error booking pocket garage:', error);
          res.status(500).json({ success: false, message: 'Something went wrong' });
        }
      };
      


      export const deletePocketGarrage = async (req, res) => {
        try {
            // Find and delete the pocket garage
            const pocket = await PocketGarrage.findByIdAndDelete(req.params.id);
            const user = await User.findById(req.user._id);
    console.log(pocket);
            if (!pocket) {
                return res.status(404).json({ success: false, message: 'Pocket garrage not found' });
            }
    
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
    
            // Remove the pocketGarrage item from the user's array
            user.pocketGarrage = user.pocketGarrage.filter(item => item.pocketGarrage._id.toString() !== pocket._id.toString());
            await user.save();
    
            // Respond with success message
            res.status(200).json({ success: true, message: 'Pocket garrage deleted successfully' });
        } catch (error) {
            // Handle errors
            console.error('Error deleting pocket garrage:', error);
            res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    };
    

      
      export const updatePocketGarrage = async (req, res) => {
        try {
          const pocket = await PocketGarrage.findByIdAndUpdate(req.params.id, req.body, { new: true });
      
          if (!pocket) {
            return res.status(404).json({ success: false, message: 'Pocket garrage not found' });
          }
      
          // Update the pocketGarrage item in the user's array
          const user = await User.findOneAndUpdate(
            { _id: req.user._id, "pocketGarrage._id": req.params.id },
            { $set: { "pocketGarrage.$": req.body } },
            { new: true }
          );
      
          res.status(200).json({ success: true, message: 'Pocket garrage updated successfully', pocket: pocket, user: user });
        } catch (error) {
          console.error('Error updating pocket garrage:', error);
          res.status(500).json({ success: false, message: 'Something went wrong' });
        }
      };

      
      export const getPocketGarrage = async (req, res) => {
        try {
          // const pocket = await PocketGarrage.findById(req.params.id);
          const user = await User.findById(req.user._id);
          if(!user){
            return res.status(404).json({ success: false, message: 'User not found' });
          }
          res.status(200).json({ success: true, message: 'Pocket garrage fetched successfully',
           pocket: user.pocketGarrage 
          });
        } catch (error) {
          console.error('Error getting pocket garrage:', error);
          res.status(500).json({ success: false, message: 'Something went wrong' });
        }
      }