const axios = require("axios");
const { CronJob } = require("cron");
const Sequelize = require("sequelize");
const config = require("./config/config.json");
const models = require("./models");

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const baseUrl = "https://preprod-dvs-api.dtone.com/v1"; // Replace with your API base URL

const syncDatabaseAndRunCronJob = async () => {
  await sequelize.sync();
  const pastTime = new Date(Date.now() + 3 * 1000); 
  const job = new CronJob(pastTime, async () => {
    // Fetch data from external API
    let traverse = true;
    let startpage = 1;
    while(traverse){
        let data = await fetchDataFromExternalAPI(startpage);
        if(!data){
            traverse = false;
        }else
        await processFetchedData(data);
    }
    // let page = 1;
    // let data = await fetchDataFromExternalAPI();
    // while(data){
    //     page++;
    //     data = await fetchDataFromExternalAPI(page);
    // }

    // // Process the fetched data
    // await processFetchedData(data);
  });

  job.start();
};

syncDatabaseAndRunCronJob();

async function fetchDataFromExternalAPI(page = 1, per_page = 50) {
  let url = `${baseUrl}/products?page=${page}&per_page=${per_page}`;
  let retries = 5;

  while (retries > 0) {
    try {
      const response = await axios.get(url,
        {
            headers: { 
              'Accept': 'application/json', 
              'Authorization': 'Basic MzExZmRiZTMtZTA4ZS00ZDVhLTlhYjItZDA1YjliM2Q4ZDk2OmVlNTRjY2I3LTM0ZmUtNDIzZC1iMzM2LTIyZDRmMmZkMmYzZA=='
            }
          }
        );

      if (
        response.data.errors &&
        response.data.errors.some((e) => e.code === 1000400)
      ) {
        return null;
      }

      return response.data;
    } catch (error) {
      retries--;
      if (retries === 0) {
        throw error;
      }
    }
  }
}

async function processFetchedData(data) {
  if (!data) {
    return;
  }

  const currentTimestamp = new Date();

  for (const productData of data) {
    const {
      id: productId,
      name,
      description,
      tags,
      service,
      operator,
      regions,
      validity,
      availability_zones,
      source,
      destination,
      prices,
      rates,
      benefits,
      promotions,
    } = productData;

    console.log('productId',productId);
    // Process the service data
    const [dbService, serviceCreated] = await models.Service.findOrCreate({
      where: { id: service.id },
      defaults: { name: service.name },
    });

    let dbSubservice = null;
    if (service.subservice) {
      [dbSubservice] = await models.Subservice.findOrCreate({
        where: { id: service.subservice.id },
        defaults: { name: service.subservice.name, service_id: service.id },
      });
    }

    // Process the operator data
    const [dbOperator, operatorCreated] = await models.Operator.findOrCreate({
      where: { id: operator.id },
      defaults: {
        name: operator.name,
        country_iso_code: operator.country.iso_code,
        country_name: operator.country.name,
        country_regions: JSON.stringify(operator.country.regions),
        regions: JSON.stringify(operator.regions),
      },
    });

    // Process the product data
    const [dbProduct, productCreated] = await models.Product.findOrCreate({
      where: { id: productId },
      defaults: {
        name,
        description,
        operator_id: operator.id,
        type: service.name, // Assuming that service name represents the type of product
        validity_quantity: validity ? validity.quantity : null,
        validity_unit: validity ? validity.unit : null,
        destination_amount: destination.amount,
        destination_unit: destination.unit,
        destination_unit_type: destination.unit_type,
        source_amount: source.amount,
        source_unit: source.unit,
        source_unit_type: source.unit_type,
        wholesale_amount: prices.wholesale.amount,
        wholesale_fee: prices.wholesale.fee,
        retail_amount: prices.retail ? prices.retail.amount : null,
        retail_fee: prices.retail? prices.retail.fee: null,
        base_rate: rates.base,
        wholesale_rate: rates.wholesale,
        retail_rate: rates.retail ? rates.retail: null,
        regions: JSON.stringify(regions),
        availability_zones: availability_zones[0], // Assuming only one availability zone per product
        service_id: service.id,
        subservice_id: dbSubservice ? dbSubservice.id : null,
      },
    });

    // Update the product's updated_at field
    await models.Product.update(
      { updated_at: currentTimestamp },
      { where: { id: productId } }
    );

    // Process the tags
    if(tags)
    for (const tagName of tags) {
      const [dbTag, tagCreated] = await models.Tags.findOrCreate({
        where: { name: tagName },
      });

      await models.ProductTags.findOrCreate({
        where: { product_id: dbProduct.id, tag_id: dbTag.id },
      });
    }

    // Process the benefits
    if(benefits)
    for (const benefitData of benefits) {
      const { type, unit_type, unit, amount, additional_information } =
        benefitData;

      await models.Benefit.create({
        type,
        unit_type,
        unit,
        amount_base: amount.base,
        promotion_bonus: amount.promotion_bonus,
        total_excluding_tax: amount.total_excluding_tax,
        total_including_tax: amount.total_including_tax,
        additional_information,
        product_id: productId,
      });
    }

    // Process the promotions
    if(promotions)
    for (const promotionData of promotions) {
      const {
        id: promotionId,
        title,
        description,
        terms,
        start_date,
        end_date,
      } = promotionData;

      await models.ProductPromotion.create({
        id: promotionId,
        title,
        description,
        terms,
        start_date,
        end_date,
        product_id: productId,
      });
    }
  }

  // Delete unupdated products
  const thresholdTimestamp = new Date(
    currentTimestamp.getTime() - 24 * 60 * 60 * 1000
  ); // 24 hours before the current timestamp
  await models.Product.destroy({
    where: {
      updated_at: {
        [models.Sequelize.Op.lt]: thresholdTimestamp,
      },
    },
  });
}
