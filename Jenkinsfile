pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        DOCKERHUB_NAMESPACE = 'liliza'
    }

    stages {
        stage('Checkout and configure') {
            steps {
                script {
                    def checkoutResult = checkout scm
                    def commit = checkoutResult.GIT_COMMIT
                    if (!commit) {
                        error('Could not determine the image tag from the checked-out commit.')
                    }
                    env.IMAGE_TAG = commit.take(12)
                    echo "Using image tag: ${env.IMAGE_TAG}"
                    if (env.DOCKERHUB_NAMESPACE.startsWith('REPLACE_')) {
                        error('Set DOCKERHUB_NAMESPACE in the Jenkinsfile before running the pipeline.')
                    }
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
                    IMAGE_TAG="$IMAGE_TAG" docker compose -p food-ordering --env-file /opt/food_ordering/.env -f docker-compose.yaml pull api frontend
                    IMAGE_TAG="$IMAGE_TAG" docker compose -p food_ordering --env-file /opt/food_ordering/.env -f docker-compose.yaml up -d --remove-orphans
                '''
            }
        }
    }
}