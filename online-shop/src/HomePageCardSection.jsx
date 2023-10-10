import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Typography } from '@mui/material';

const HomePageCardSection = ({ propRef, propRef2, className, hide }) => {
  const favorites =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2Ficon-star-copy-01.svg?alt=media&token=c1e2cd13-58b4-440f-b01f-1169202c253c&_gl=1*e9kma0*_ga*NDM5ODMxODMzLjE2ODQ0MTcyMTE.*_ga_CW55HF8NVT*MTY5NjM3NDgyNC4xNDQuMS4xNjk2Mzc0OTA3LjM3LjAuMA..';
  const autoCalculate =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FDALL%C2%B7E%202023-08-23%2011.29.52%20-%20A%20vector%20illustration%20of%20a%20person%20using%20a%20calculator.png?alt=media&token=710cc90e-15bf-4ab9-a6d9-8946fc52009c&_gl=1*18n3y0l*_ga*NDM5ODMxODMzLjE2ODQ0MTcyMTE.*_ga_CW55HF8NVT*MTY5NjM3NDgyNC4xNDQuMS4xNjk2Mzc0OTYwLjQ0LjAuMA..';
  const pinpoint =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2Flocation_icon-star-copy-02.svg?alt=media&token=0cc4139c-4e2f-4e24-abe4-b4f34e9a9a8d&_gl=1*1aufqaa*_ga*NDM5ODMxODMzLjE2ODQ0MTcyMTE.*_ga_CW55HF8NVT*MTY5NjM3NDgyNC4xNDQuMS4xNjk2Mzc0OTkxLjEzLjAuMA..';
  const customerChat =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2Fchaticon-star-copy-03.svg?alt=media&token=51a46c08-a673-4d16-ba73-56c5c1f931a0&_gl=1*jnbm3j*_ga*NDM5ODMxODMzLjE2ODQ0MTcyMTE.*_ga_CW55HF8NVT*MTY5NjM3NDgyNC4xNDQuMS4xNjk2Mzc1MDEzLjYwLjAuMA..';
  const saved =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FSave-Map_icon-star-copy-04.svg?alt=media&token=2fa494fc-5387-4e49-9f49-1e2166fe67f3&_gl=1*1nbp2b8*_ga*NDM5ODMxODMzLjE2ODQ0MTcyMTE.*_ga_CW55HF8NVT*MTY5NjM3NDgyNC4xNDQuMS4xNjk2Mzc1MDQxLjMyLjAuMA..';
  const multiple =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2Fmultiplepayment-05%20(1).svg?alt=media&token=3cd6fdfd-9d71-4ce4-afc2-3feec5891d93&_gl=1*cajvd3*_ga*NDM5ODMxODMzLjE2ODQ0MTcyMTE.*_ga_CW55HF8NVT*MTY5NjM3NDgyNC4xNDQuMS4xNjk2Mzc1MDY1LjguMC4w';

  return (
    <div>
      <section ref={propRef} className={className}>
        {hide?.includes(0) ? null : (
          <article>
            <Card ref={propRef2} sx={{ width: 250, flexShrink: 0, height: '100%' }} elevation={20}>
              <CardMedia
                sx={{ height: 210, backgroundColor: '#e1fadd' }}
                image={autoCalculate}
                title="auto calculate"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Auto Calculate Cost
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The delivery fee and total cost of items will be calculated at checkout. There will be no hidden
                  charges after delivery.
                </Typography>
              </CardContent>
            </Card>
          </article>
        )}
        {hide?.includes(1) ? null : 
        <article>
          <Card sx={{ width: 250, flexShrink: 0, height: '100%' }} elevation={20}>
            <CardMedia sx={{ height: 210, backgroundColor: '#e1fadd' }} image={favorites} title="favorite items" />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Favorite Items
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Adding your favorite items to your 'Favorites' list for quick and convenient access.
              </Typography>
            </CardContent>
          </Card>
        </article>
        }
        {hide?.includes(2) ? null :
        <article>
          <Card sx={{ width: 250, flexShrink: 0, height: '100%' }} elevation={20}>
            <CardMedia
              sx={{ height: 210, backgroundColor: '#e1fadd' }}
              image={pinpoint}
              title="pinpoint delivery locations"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Pinpoint Location
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Who needs big signs or landmarks when you can pinpoint your exact location!
              </Typography>
            </CardContent>
          </Card>
        </article>
        }
        {hide?.includes(3) ? null :
        <article>
          <Card sx={{ width: 250, flexShrink: 0, height: '100%' }} elevation={20}>
            <CardMedia
              sx={{ height: 210, backgroundColor: '#e1fadd' }}
              image={saved}
              title="save location and contacts"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Save Location and Contacts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This makes it quicker and easier to fill in the details for your next order.
              </Typography>
            </CardContent>
          </Card>
        </article>
        }
        {hide?.includes(4) ? null :
        <article>
          <Card sx={{ width: 250, flexShrink: 0, height: '100%' }} elevation={20}>
            <CardMedia
              sx={{ height: 210, backgroundColor: '#e1fadd' }}
              image={customerChat}
              title="chat with customer"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Chat with Customer Service
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Any questions or concerns? There is a chat customer service available to help you out.
              </Typography>
            </CardContent>
          </Card>
        </article>
        }
        {hide?.includes(5) ? null :
        <article>
          <Card sx={{ width: 250, flexShrink: 0, height: '100%' }} elevation={20}>
            <CardMedia sx={{ height: 210, backgroundColor: '#e1fadd' }} image={multiple} title="multiple payment" />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Multiple Payment Methods
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gives you the flexibility to choose the option that is most convenient and suits your preferences.
              </Typography>
            </CardContent>
          </Card>
        </article>
        }
      </section>
    </div>
  );
};

export default HomePageCardSection;
