import mongoose, { model } from 'mongoose';
import slugify from 'slugify';

async function generateSlug(slugName, modelName) {
  const slug = slugify(slugName);
  var regex = new RegExp(`^${slug}(-\\d+)?$`);
  try {
    const doc = await mongoose.model(modelName).findOne({ slug: slug }).exec();
    if (!doc) {
      return slug;
    }

    const docs = await mongoose
      .model(modelName)
      .find({ slug: { $regex: regex } });

    let maxCount = docs.reduce((max, doc) => {
      let count = parseInt(doc.slug.split('-').pop()) || 0;

      return Math.max(max, count);
    }, 0); //! max initialize ~ 0
    return `${slug}-${maxCount + 1}`;
  } catch (error) {
    console.log('__generateSlug\n__catch__error: ', error, '\n');
    throw error;
  }
}

export default generateSlug;
