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
