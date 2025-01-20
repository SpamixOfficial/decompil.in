use std::process::exit;

use anyhow::{anyhow, Result};
use colored::Colorize;
use inquire::{MultiSelect, Select};
use reqwest::{Client, StatusCode};
use serde::{Deserialize, Serialize};
use std::convert::AsRef;
use std::str::FromStr;
use strum::{AsRefStr, EnumString};

const TOKEN: &str = include_str!("../token");
const HOST: &str = include_str!("../host");

#[derive(Serialize, Deserialize, Debug)]
pub struct Guide {
    #[serde(rename = "id")]
    id: usize,

    #[serde(rename = "challengeId")]
    challenge_id: usize,

    #[serde(rename = "userId")]
    user_id: String,

    #[serde(rename = "body")]
    body: String,

    #[serde(rename = "createdAt")]
    created_at: String,

    #[serde(rename = "approved")]
    approved: bool,

    #[serde(rename = "user")]
    user: User,

    #[serde(rename = "challenge")]
    challenge: Challenge,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Challenge {
    #[serde(rename = "id")]
    id: usize,

    #[serde(rename = "title")]
    title: String,

    #[serde(rename = "description")]
    description: String,

    #[serde(rename = "flag")]
    flag: String,

    #[serde(rename = "score")]
    score: usize,

    #[serde(rename = "solves")]
    solves: usize,

    #[serde(rename = "category")]
    category: Option<ChallengeCategory>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct User {
    #[serde(rename = "id")]
    id: String,

    #[serde(rename = "name")]
    name: String,

    #[serde(rename = "email")]
    email: String,

    #[serde(rename = "emailVerified")]
    email_verified: bool,

    #[serde(rename = "image")]
    image: String,

    #[serde(rename = "createdAt")]
    created_at: String,

    #[serde(rename = "updatedAt")]
    updated_at: String,

    #[serde(rename = "score")]
    score: usize,

    #[serde(rename = "githubUrl")]
    github_url: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ChallengeExternal {
    #[serde(rename = "id")]
    id: usize,

    #[serde(rename = "title")]
    title: String,

    #[serde(rename = "description")]
    description: String,

    #[serde(rename = "score")]
    score: usize,
}
#[derive(Serialize, Deserialize, Debug)]
pub enum ChallengeCategory {
    #[serde(rename = "misc")]
    Misc,
    #[serde(rename = "rev")]
    Rev,
    #[serde(rename = "pwn")]
    Pwn,
    #[serde(rename = "web")]
    Web,
    #[serde(rename = "crypt")]
    Crypto,
    #[serde(rename = "osint")]
    Osint,
}

#[derive(Debug, AsRefStr, PartialEq, EnumString)]
enum MenuOptions {
    #[strum(serialize = "Get all challenges")]
    GetAllChallenges,
    #[strum(serialize = "Get all guides")]
    GetAllGuides,
    #[strum(serialize = "Approve guides")]
    ApproveGuides,
    #[strum(serialize = "Unapprove guide")]
    UnapproveGuides,
    #[strum(serialize = "Approve guide")]
    ApproveGuide,
    #[strum(serialize = "Deny guide")]
    DenyGuide,
    #[strum(serialize = "Next guide")]
    NextGuide,
    #[strum(serialize = "Exit")]
    Exit,
}

#[tokio::main]
async fn main() -> Result<()> {
    // Create http(s) client
    let client = Client::new();

    match check_auth(&client).await {
        Ok(_) => (),
        Err(e) => {
            eprintln!("{e}");
            exit(1);
        }
    }

    // more options to come
    // Make mutable to allow sub-menus to change menu options when that is introduced!
    let options = vec![
        MenuOptions::GetAllChallenges.as_ref(),
        MenuOptions::GetAllGuides.as_ref(),
        MenuOptions::ApproveGuides.as_ref(),
        MenuOptions::UnapproveGuides.as_ref(),
        MenuOptions::Exit.as_ref(),
    ];
    loop {
        let ans = match Select::new("Choose a menu option", options.clone()).prompt() {
            Err(e) => {
                eprintln!("Error: {}. Exiting!", e.to_string());
                exit(1);
            }
            Ok(x) => x,
        };

        match MenuOptions::from_str(ans)? {
            MenuOptions::ApproveGuides => {
                let guides = get_unapproved_guides(&client).await?;
                if guides.is_empty() {
                    println!("No guides to approve!");
                }
                for guide in guides {
                    approve_prompt(&client, guide).await?;
                }
            }
            MenuOptions::GetAllChallenges => {
                get_challenges(&client).await?;
            }
            MenuOptions::GetAllGuides => {
                let result = get_guides(&client).await?;
                dbg!(result);
            }
            MenuOptions::UnapproveGuides => {
                let guides = get_approved_guides(&client).await?;
                let unapprove_options: Vec<usize> = guides.iter().map(|x| x.id).collect();

                let ans = match MultiSelect::new("Choose guides to unapprove", unapprove_options)
                    .prompt()
                {
                    // most likely the user cancelled the operation
                    Err(_) => vec![],
                    Ok(x) => x,
                };
                if ans.is_empty() {
                    println!("No guides to unapprove!");
                }
                for id in ans {
                    unapprove_guide(&client, id).await?;
                }
            }
            _ => break,
        }
    }

    Ok(())
}

async fn check_auth(client: &Client) -> Result<()> {
    let resp = client
        .get(format!("{HOST}/authenticated"))
        .bearer_auth(TOKEN)
        .send()
        .await?;
    if resp.status() != StatusCode::OK {
        return Err(anyhow!(
            "Authentication token is invalid, recompile with correct token please!",
        ));
    }

    return Ok(());
}

async fn get_challenges(client: &Client) -> Result<()> {
    let resp = client
        .get(format!("{HOST}/ctf/challenges"))
        .bearer_auth(TOKEN)
        .send()
        .await?;
    let challs: Vec<ChallengeExternal> = resp.json().await?;
    dbg!(challs);
    return Ok(());
}

async fn get_unapproved_guides(client: &Client) -> Result<Vec<Guide>> {
    let resp = client
        .get(format!("{HOST}/ctf/guides/unapproved"))
        .bearer_auth(TOKEN)
        .send()
        .await?;
    let guides: Vec<Guide> = resp.json().await?;
    return Ok(guides);
}

async fn get_guides(client: &Client) -> Result<Vec<Guide>> {
    let resp = client
        .get(format!("{HOST}/ctf/guides"))
        .bearer_auth(TOKEN)
        .send()
        .await?;
    let guides: Vec<Guide> = resp.json().await?;
    return Ok(guides);
}

async fn get_approved_guides(client: &Client) -> Result<Vec<Guide>> {
    let resp = client
        .get(format!("{HOST}/ctf/guides/approved"))
        .bearer_auth(TOKEN)
        .send()
        .await?;
    let guides: Vec<Guide> = resp.json().await?;
    return Ok(guides);
}

async fn approve_guide(client: &Client, id: usize, guide_id: usize) -> Result<()> {
    let resp = client
        .post(format!(
            "{HOST}/ctf/challenge/{}/guides/{}/approve",
            id, guide_id
        ))
        .bearer_auth(TOKEN)
        .send()
        .await?;
    if resp.status() != 200 {
        return Err(anyhow!(
            "Something went wrong????\n\n{:?}",
            resp.text().await?
        ));
    }
    return Ok(());
}

async fn unapprove_guide(client: &Client, guide_id: usize) -> Result<()> {
    let resp = client
        .post(format!("{HOST}/ctf/guides/{}/unapprove", guide_id))
        .bearer_auth(TOKEN)
        .send()
        .await?;
    if resp.status() != 200 {
        return Err(anyhow!(
            "Something went wrong????\n\n{:?}",
            resp.text().await?
        ));
    }
    return Ok(());
}

async fn deny_guide(client: &Client, guide_id: usize) -> Result<()> {
    let resp = client
        .delete(format!("{HOST}/ctf/guides/{}/", guide_id))
        .bearer_auth(TOKEN)
        .send()
        .await?;
    if resp.status() != 200 {
        return Err(anyhow!(
            "Something went wrong????\n\n{:?}",
            resp.text().await?
        ));
    }
    return Ok(());
}

async fn approve_prompt(client: &Client, guide: Guide) -> Result<()> {
    let options = vec![
        MenuOptions::ApproveGuide.as_ref(),
        MenuOptions::DenyGuide.as_ref(),
        MenuOptions::NextGuide.as_ref(),
    ];
    let message = format!(
        "Manage the guide\n{}: {}\n{}: {}\n{}: {}\n\n--- {} ---\n\n{}\n\n",
        "By".bold().green(),
        guide.user.email,
        "For".bold().green(),
        guide.challenge.title,
        "Flag".bold().green(),
        guide.challenge.flag,
        "Body".bold(),
        guide.body
    );

    let ans = match Select::new(&message, options).prompt() {
        Err(e) => {
            eprintln!("Error: {}. Exiting!", e.to_string());
            exit(1)
        }
        Ok(x) => x,
    };

    match MenuOptions::from_str(ans)? {
        MenuOptions::ApproveGuide => approve_guide(client, guide.challenge_id, guide.id).await?,
        MenuOptions::DenyGuide => deny_guide(client, guide.id).await?,
        _ => (),
    }
    return Ok(());
}
