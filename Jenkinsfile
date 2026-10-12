pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        DOCKERHUB_NAMESPACE = 'liliza'
        IMAGE_TAG = ''
    }

    stages {
        stage('Checkout and configure') {
            steps {
                checkout scm
                script {
                    if (env.DOCKERHUB_NAMESPACE.startsWith('REPLACE_')) {
                        error('Set DOCKERHUB_NAMESPACE in the Jenkinsfile before running the pipeline.')
                    }
                    env.IMAGE_TAG = sh(script: 'git rev-parse --short=12 HEAD', returnStdout: true).trim()
                }
            }
        }

        stage('Build images') {
            steps {
                sh '''
                    docker build -t "$DOCKERHUB_NAMESPACE/food_ordering_api:$IMAGE_TAG" ./backend
                    docker build -t "$DOCKERHUB_NAMESPACE/food_ordering_frontend:$IMAGE_TAG" ./frontend
                '''
            }
        }

        stage('Publish images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_TOKEN')]) {
                    sh '''
                        set -eu
                        trap 'docker logout >/dev/null 2>&1 || true' EXIT
                        printf '%s' "$DOCKERHUB_TOKEN" | docker login --username "$DOCKERHUB_USER" --password-stdin
                        docker push "$DOCKERHUB_NAMESPACE/food_ordering_api:$IMAGE_TAG"
                        docker push "$DOCKERHUB_NAMESPACE/food_ordering_frontend:$IMAGE_TAG"
                    '''
                }
            }
        }

        stage('Deploy on EC2') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    set -eu
                    docker compose -p food-ordering --env-file /opt/food-ordering/.env -f docker-compose.yaml pull api frontend
                    docker compose -p food-ordering --env-file /opt/food-ordering/.env -f docker-compose.yaml up -d --remove-orphans
                '''
            }
        }
    }
}