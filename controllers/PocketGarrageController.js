import PocketGarrage from "../models/pocketGarrage.js";
import { User } from "../models/users.js";
import Expert from "../models/expert.js";




export const createPocketGarrage = async (req, res) => {
    try {
        // Extract relevant data from the request body
        const {
            name, email, description, expires, carBrand, carModel, year, certificates,
            carImages, Registration, InspectionCertificates,
            historyFile, ownershipHistory, invoicesBill,
            AdditionalPhotos, additionalDocuments
        } = req.body;

        // Check if the user exists
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if the expert exists using req.body.id
        const expert = await Expert.findById(req.body._id);
        if (!expert) {
            return res.status(404).json({ success: false, message: 'Expert not found' });
        }

        // Save PocketGarrage as a standalone document
        const pocket = new PocketGarrage({
            name, email, description, expires, carBrand, carModel, year, certificates,
            carImages, Registration, InspectionCertificates,
            historyFile, ownershipHistory, invoicesBill,
            AdditionalPhotos, additionalDocuments,
            owner: user._id,
            expert: expert._id
        });

        await pocket.save();

        // Save PocketGarrage for User
        user.pocketGarrage.push({
            name, email, description, expires, carBrand, carModel, year, certificates,
            carImages, Registration, InspectionCertificates,
            historyFile, ownershipHistory, invoicesBill,
            AdditionalPhotos, additionalDocuments
        });
        await user.save();

        // Save PocketGarrage for Expert
        expert.pocketGarrage.push({
            name, email, description, expires, carBrand, carModel, year, certificates,
            carImages, Registration, InspectionCertificates,
            historyFile, ownershipHistory, invoicesBill,
            AdditionalPhotos, additionalDocuments
        });
        await expert.save();

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



      export const deletePocketGarrage = async (req, res) => {
        try {
          const pocket = await PocketGarrage.findByIdAndDelete(req.params.id);
          const user = await User.findById(req.user._id);
      
          if (!pocket) {
            return res.status(404).json({ success: false, message: 'Pocket garrage not found' });
          }
      
          if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
          }
      
          // Remove the pocketGarrage item from the user's array
          await user.updateOne({ $pull: { pocketGarrage: { _id: req.params.id } } });
      
          res.status(200).json({ success: true, message: 'Pocket garrage deleted successfully' });
        } catch (error) {
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
          res.status(200).json({ success: true, message: 'Pocket garrage fetched successfully', pocket: user.pocketGarrage });
        } catch (error) {
          console.error('Error getting pocket garrage:', error);
          res.status(500).json({ success: false, message: 'Something went wrong' });
        }
      }