const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');


// generic functions :
// 1. to delete one model 
exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    // await Tour.deleteOne({ _id: req.params.id });
    const document = await Model.findByIdAndDelete(req.params.id);
  
    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }
  
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

// 2. to update one model
exports.updateOne = Model=> catchAsync(async (req, res, next) => {
  const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!document) {
    return next(new AppError('No document found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      data: document,
    },
  });
});

//3. to create one model
exports.createOne = Model => catchAsync(async (req, res, next) => {
  const document = await Model.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      data: document,
    },
  });
  next();
});

//4. to get one model
exports.getOne = (Model, popOptions)=>catchAsync(async (req, res, next) => {
  let query = Model.findById(req.params.id);
  if(popOptions) query = query.populate(popOptions);

  const document = await query;
  
  if (!document) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: document,
    },
  });
});

//4. to get all models
exports.getAll = Model=>catchAsync(async (req, res, next) => {
  // To allow for nested GET reviews on tour (hack)
  let filter= {};
  if(req.params.tourId) filter={tour: req.params.tourId};
  //EXECUTE QUERY
  const features = new APIFeatures(Model.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const document = await features.query;

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: document.length,
    data: {
      data: document,
    },
  });
});