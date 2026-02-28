// controllers/adminClientController.js
const ClientChangeRequest = require("../models/ClientChangeRequest");

const Client = require("../models/Client");

exports.getClientChangeForm = async (req, res) => {
	try {
		console.log("🟢 ADMIN FETCH CLIENT CHANGE FORM");

		const request = await ClientChangeRequest.findById(req.params.id)
			.populate({
				path: "clientId",
				select: "-__v",
			})
			.populate({
				path: "requestedBy",
				select: "name email",
			})
			.populate({
				path: "reviewedBy",
				select: "name email",
			});

		if (!request) {
			return res.status(404).json({
				message: "Change request not found",
			});
		}

		return res.status(200).json({
			client: request.clientId,
			request,
		});
	} catch (err) {
		console.error("❌ GET CLIENT CHANGE FORM ERROR:", err);
		return res.status(500).json({
			message: "Failed to load change request",
		});
	}
};

/* ===============================
   APPROVE + APPLY ADMIN CHANGES
================================ */
exports.approveClientChangeRequest = async (req, res) => {
	try {
		console.log("🟢 APPROVE CLIENT CHANGE REQUEST");

		const requestId = req.params.id;
		const adminUpdates = req.body.updatedClient;

		if (!adminUpdates) {
			return res.status(400).json({
				message: "updatedClient payload is required",
			});
		}

		const request = await ClientChangeRequest.findById(requestId);

		if (!request) {
			return res.status(404).json({ message: "Request not found" });
		}

		if (request.status !== "pending") {
			return res.status(400).json({
				message: "Request already processed",
			});
		}

		const client = await Client.findById(request.clientId).lean();

		if (!client) {
			return res.status(404).json({ message: "Client not found" });
		}

		/* ===============================
       DIFF: ADMIN vs ORIGINAL CLIENT
    ================================ */
		const updateSet = {};

		const flatten = (obj, prefix = "") => {
			Object.entries(obj || {}).forEach(([key, value]) => {
				const path = prefix ? `${prefix}.${key}` : key;

				if (
					value !== null &&
					typeof value === "object" &&
					!Array.isArray(value)
				) {
					flatten(value, path);
				} else {
					const originalValue = path
						.split(".")
						.reduce((o, k) => o?.[k], client);

					// ✅ only include if admin ACTUALLY changed it
					if (String(originalValue ?? "") !== String(value ?? "")) {
						updateSet[path] = value;
					}
				}
			});
		};

		flatten(adminUpdates);

		if (Object.keys(updateSet).length === 0) {
			return res.status(400).json({
				message: "No changes detected by admin",
			});
		}

		console.log("✅ FINAL ADMIN UPDATES:", updateSet);

		/* ===============================
       APPLY UPDATE
    ================================ */
		await Client.updateOne(
			{ _id: client._id },
			{
				$set: {
					...updateSet,
					lastUpdatedBy: req.user.id,
				},
			},
		);

		/* ===============================
       FINALIZE REQUEST
    ================================ */
		request.status = "approved";
		request.reviewedBy = req.user.id;
		request.reviewedAt = new Date();
		request.appliedChanges = updateSet;
		await request.save();

		res.json({
			success: true,
			message: "Client updated with admin-approved changes",
			appliedChanges: updateSet,
		});
	} catch (err) {
		console.error("❌ APPROVE ERROR:", err);
		res.status(500).json({
			message: "Failed to approve request",
			error: err.message,
		});
	}
};

exports.rejectClientChangeRequest = async (req, res) => {
	try {
		const request = await ClientChangeRequest.findById(req.params.id);

		if (!request || request.status !== "pending") {
			return res.status(404).json({
				message: "Request not found or already processed",
			});
		}

		request.status = "rejected";
		request.reviewedBy = req.user.id;
		request.reviewedAt = new Date();
		await request.save();

		return res.json({
			success: true,
			message: "Change request rejected",
		});
	} catch (err) {
		console.error("❌ REJECT CLIENT CHANGE ERROR:", err);
		res.status(500).json({
			message: "Failed to reject request",
		});
	}
};

exports.getPendingRequests = async (req, res) => {
	try {
		// console.log("🟢 FETCH ALL CLIENT CHANGE REQUESTS");

		const requests = await ClientChangeRequest.find({})
			.populate({
				path: "clientId",
				select: "name phone clientCode",
			})
			.populate({
				path: "requestedBy",
				select: "name email",
			})
			.populate({
				path: "reviewedBy",
				select: "name email",
			})
			.sort({ createdAt: -1 });

		return res.status(200).json({
			success: true,
			count: requests.length,
			requests,
		});
	} catch (err) {
		console.error("❌ FETCH CLIENT CHANGE REQUESTS ERROR:", err);
		return res.status(500).json({
			success: false,
			message: "Failed to fetch client change requests",
		});
	}
};

exports.approveRequest = async (req, res) => {
	try {
		const request = await ClientChangeRequest.findById(req.params.requestId);

		if (!request || request.status !== "pending") {
			return res
				.status(404)
				.json({ message: "Request not found or already processed" });
		}

		await Client.findByIdAndUpdate(request.clientId, {
			$set: {
				...request.requestedChanges,
				lastUpdatedBy: req.user._id,
			},
		});

		request.status = "approved";
		request.reviewedBy = req.user._id;
		request.reviewedAt = new Date();
		await request.save();

		res.json({ message: "Client update approved and applied" });
	} catch (err) {
		console.error("APPROVE ERROR:", err);
		res.status(500).json({ message: "Server error" });
	}
};

exports.rejectRequest = async (req, res) => {
	try {
		const { comment } = req.body;

		const request = await ClientChangeRequest.findById(req.params.requestId);

		if (!request || request.status !== "pending") {
			return res
				.status(404)
				.json({ message: "Request not found or already processed" });
		}

		request.status = "rejected";
		request.adminComment = comment || "Rejected by admin";
		request.reviewedBy = req.user._id;
		request.reviewedAt = new Date();

		await request.save();

		res.json({ message: "Change request rejected" });
	} catch (err) {
		console.error("REJECT ERROR:", err);
		res.status(500).json({ message: "Server error" });
	}
};
