const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // Hack: This part will only be used for reviews nested in tours route, for rest of the routes filter will remain {}.
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .project()
      .paginate();

    // const docs = await features.query.explain();
    const docs = await features.query;
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });

exports.getOne = (Model, populateOptionsObj) =>
  catchAsync(async (req, res, next) => {
    const query = Model.findById(req.params.id);
    if (populateOptionsObj) query.populate(populateOptionsObj);
    const doc = await query;
    if (!doc) {
      return next(new AppError('No doc with the specified id found!', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('No doc with the specified id found!', 404));
    }
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(
        new AppError('No document with the specified id found!', 404),
      );
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
